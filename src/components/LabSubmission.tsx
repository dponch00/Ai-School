import { useState } from 'react'
import type { Practice } from '../domain/content'
import type { PracticeSubmission } from '../domain/learner'
import { db } from '../storage/db'
import { addPracticeReview, getSubmission, reviewPrompt, saveSubmission, type SubmissionDraft } from '../storage/learner'
import { newLocalId } from '../storage/progress'
import { useLive } from '../storage/useLive'

type Level = PracticeSubmission['selfAssessment'][number]['level']
type Notebook = NonNullable<PracticeSubmission['notebook']>

const STATE_TEXT: Record<PracticeSubmission['state'], string> = {
  presented: 'Presentada: falta el cuaderno o la autoevaluación de algún criterio',
  'self-assessed': 'Autoevaluada: completa, sin revisión externa todavía',
  'review-pending': 'Revisión pendiente',
  reviewed: 'Revisada por dos revisiones independientes',
}
const NOTEBOOK: [keyof Notebook, string][] = [
  ['initialDecision', 'Decisión inicial (antes de abrir el cambio del lunes)'],
  ['counterexample', 'Contraejemplo: qué pasaría con tu especificación tal como estaba'],
  ['revisedDecision', 'Decisión revisada y por qué'],
  ['evidenceForChange', 'Evidencia: el dato, caso o regla que te hizo cambiar (o por qué no hizo falta)'],
]
const emptyNotebook: Notebook = { initialDecision: '', counterexample: '', revisedDecision: '', evidenceForChange: '' }

/** Entrega del laboratorio: texto, evidencias, cuaderno de decisiones y autoevaluación por criterio. */
export default function LabSubmission({ practice }: { practice: Practice }) {
  // El formulario se monta cuando ya se leyó la entrega guardada, para arrancar con esos valores.
  const loaded = useLive(async () => ({ stored: await getSubmission(db, practice.id) }), [practice.id], null as { stored?: PracticeSubmission } | null)
  return loaded ? (
    <>
      <SubmissionForm practice={practice} stored={loaded.stored} />
      {loaded.stored && loaded.stored.state !== 'presented' && <ReviewPanel practice={practice} submission={loaded.stored} />}
      {loaded.stored?.state === 'presented' && (
        <section className="section" aria-labelledby="revisiones">
          <h2 id="revisiones">Revisiones externas</h2>
          <p className="muted">Cuando completes el cuaderno y la autoevaluación de todos los criterios, aquí podrás pedir y registrar revisiones externas de tu entrega.</p>
        </section>
      )}
    </>
  ) : null
}

function SubmissionForm({ practice, stored }: { practice: Practice; stored?: PracticeSubmission }) {
  const [text, setText] = useState(stored?.text ?? '')
  const [evidence, setEvidence] = useState<SubmissionDraft['evidence']>(stored?.evidence ?? [])
  const [notebook, setNotebook] = useState<Notebook>(stored?.notebook ?? emptyNotebook)
  const [self, setSelf] = useState<Record<string, { level: Level | ''; evidence: string }>>(
    () => Object.fromEntries((stored?.selfAssessment ?? []).map((s) => [s.criterionId, { level: s.level, evidence: s.evidence }])),
  )
  const [status, setStatus] = useState<string | null>(null)

  const save = async () => {
    const notebookFilled = Object.values(notebook).every((v) => v.trim())
    try {
      const saved = await saveSubmission(db, practice, {
        text,
        evidence: evidence.filter((x) => x.value.trim()),
        notebook: practice.transferNotebook && notebookFilled ? notebook : undefined,
        selfAssessment: practice.rubric
          .filter((c) => self[c.id]?.level !== undefined && self[c.id]?.level !== '' && self[c.id]?.evidence.trim())
          .map((c) => ({ criterionId: c.id, level: self[c.id].level as Level, evidence: self[c.id].evidence })),
      })
      const missing = [
        practice.transferNotebook && !notebookFilled ? 'completar las cuatro partes del cuaderno' : null,
        saved.selfAssessment.length < practice.rubric.length ? `autoevaluar ${practice.rubric.length - saved.selfAssessment.length} criterio(s) con nivel y evidencia` : null,
      ].filter(Boolean)
      setStatus(`Guardada. Estado: ${STATE_TEXT[saved.state]}.${missing.length ? ` Para que cuente como autoevaluada falta ${missing.join(' y ')}.` : ''}`)
    } catch (e) {
      setStatus(`No se pudo guardar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <section className="section form-page" aria-labelledby="entrega">
      <h2 id="entrega">Tu entrega</h2>
      <p className="muted">Se guarda solo en este navegador y puedes incluirla en un reporte de evaluación. Usa datos sintéticos: el laboratorio no necesita nada real.</p>
      {stored && <p className="notice notice--info">Estado actual: {STATE_TEXT[stored.state]}.</p>}

      <label>Entrega <small>(pega el brief, los criterios y el prompt, o un resumen; {text.length} de 20 000 caracteres)</small>
        <textarea rows={10} maxLength={20000} value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      <fieldset className="form-group">
        <legend>Evidencias</legend>
        <p className="muted">La salida del script de reconciliación, una captura descrita o un enlace. Lo que marques como «no incluir» aparecerá en el reporte como pendiente de inspección, sin su contenido.</p>
        {evidence.map((x, i) => (
          <div key={i} className="evidence-row">
            <label>Tipo
              <select value={x.kind} onChange={(e) => setEvidence(evidence.map((y, j) => (j === i ? { ...y, kind: e.target.value as typeof x.kind } : y)))}>
                <option value="text">Texto</option>
                <option value="link">Enlace</option>
                <option value="file-reference">Archivo (nombre)</option>
              </select>
            </label>
            <label>Contenido <textarea rows={2} maxLength={4000} value={x.value} onChange={(e) => setEvidence(evidence.map((y, j) => (j === i ? { ...y, value: e.target.value } : y)))} /></label>
            <label className="check"><input type="checkbox" checked={x.includedInReport} onChange={(e) => setEvidence(evidence.map((y, j) => (j === i ? { ...y, includedInReport: e.target.checked } : y)))} /> Incluir en el reporte</label>
            <button type="button" className="button" onClick={() => setEvidence(evidence.filter((_, j) => j !== i))}>Quitar</button>
          </div>
        ))}
        <button type="button" className="button" onClick={() => setEvidence([...evidence, { kind: 'text', value: '', includedInReport: true }])}>Agregar evidencia</button>
      </fieldset>

      {practice.transferNotebook && (
        <fieldset className="form-group">
          <legend>Cuaderno de decisiones</legend>
          {NOTEBOOK.map(([k, label]) => (
            <label key={k}>{label}
              <textarea rows={3} maxLength={4000} value={notebook[k]} onChange={(e) => { const v = e.target.value; setNotebook((prev) => ({ ...prev, [k]: v })) }} />
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="form-group">
        <legend>Autoevaluación con la rúbrica</legend>
        <p className="muted">Primero cita la parte de tu entrega que lo demuestra; después elige el nivel. Una autoevaluación nunca cuenta como revisión independiente.</p>
        {practice.rubric.map((c) => (
          <div key={c.id} className="self-row">
            <p><strong>{c.name}</strong>{c.critical && <span className="badge">Crítico</span>}</p>
            <label>Evidencia que citas <textarea rows={2} maxLength={2000} value={self[c.id]?.evidence ?? ''} onChange={(e) => { const evidence = e.target.value; setSelf((prev) => ({ ...prev, [c.id]: { level: prev[c.id]?.level ?? '', evidence } })) }} /></label>
            <label>Nivel
              <select value={String(self[c.id]?.level ?? '')} onChange={(e) => { const v = e.target.value; setSelf((prev) => ({ ...prev, [c.id]: { evidence: prev[c.id]?.evidence ?? '', level: v === '' ? '' : v === 'insufficient-evidence' ? 'insufficient-evidence' : (Number(v) as Level) } })) }}>
                <option value="">Sin elegir</option>
                {c.levels.map((l) => <option key={l.level} value={l.level}>{l.level}</option>)}
                <option value="insufficient-evidence">Evidencia insuficiente</option>
              </select>
            </label>
          </div>
        ))}
      </fieldset>

      <button type="button" className="button button--primary" onClick={save}>Guardar entrega</button>
      {status && <p role="status">{status}</p>}
    </section>
  )
}

const LEVEL_TEXT = (l: Level) => (l === 'insufficient-evidence' ? 'evidencia insuficiente' : String(l))

/**
 * Revisiones externas (F2-02): se piden con la instrucción de abajo, en una conversación nueva cada vez,
 * y se registran aquí. «Revisada» exige dos revisiones de corridas distintas sin discrepar más de un nivel.
 */
function ReviewPanel({ practice, submission }: { practice: Practice; submission: PracticeSubmission }) {
  const reviews = submission.reviews
  const [name, setName] = useState('')
  const [type, setType] = useState<'external-assisted' | 'human'>('external-assisted')
  const [model, setModel] = useState('')
  const [sameRun, setSameRun] = useState(false)
  const [crit, setCrit] = useState<Record<string, { level: Level | ''; quote: string }>>({})
  const [status, setStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const prompt = reviewPrompt(practice)
  const complete = practice.rubric.every((c) => crit[c.id]?.level && crit[c.id]?.quote.trim())

  const save = async () => {
    setSaving(true)
    try {
      const last = reviews.at(-1)
      const next = await addPracticeReview(db, practice, {
        runId: sameRun && last ? last.runId : `corrida-${newLocalId().slice(0, 10)}`,
        reviewer: { declaredName: name.trim(), type, ...(model.trim() ? { model: model.trim() } : {}) },
        criteria: practice.rubric.map((c) => ({ criterionId: c.id, evidenceQuote: crit[c.id].quote.trim(), level: crit[c.id].level as Level })),
      })
      // Cada revisión se registra desde cero: la casilla de «misma conversación» no se arrastra a la siguiente.
      setCrit({})
      setSameRun(false)
      setName('')
      setStatus(`Revisión registrada. Estado de la entrega: ${STATE_TEXT[next.state]}.`)
    } catch (e) {
      setStatus(`No se pudo registrar: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setSaving(false)
    }
  }

  const lastTwo = reviews.slice(-2)
  const gaps =
    lastTwo.length === 2
      ? practice.rubric.filter((c) => {
          const [a, b] = lastTwo.map((r) => r.criteria.find((x) => x.criterionId === c.id)?.level)
          if (a === undefined || b === undefined) return false
          if (a === 'insufficient-evidence' || b === 'insufficient-evidence') return a !== b
          return Math.abs(a - b) > 1
        })
      : []

  return (
    <section className="section form-page" aria-labelledby="revisiones">
      <h2 id="revisiones">Revisiones externas</h2>
      <p className="muted">
        Tu autoevaluación no cuenta como revisión. Pide a un evaluador (una persona o una IA, cada vez en una conversación nueva) que revise tu entrega con esta instrucción y registra aquí lo que conteste. La entrega queda «revisada» cuando las dos últimas revisiones vienen de corridas distintas y no discrepan más de un nivel en ningún criterio.
      </p>
      <details className="model-answer">
        <summary>Instrucción para el revisor</summary>
        <pre className="prompt-block">{prompt}</pre>
        <button
          type="button"
          className="button"
          onClick={() => navigator.clipboard.writeText(prompt).then(() => setCopied(true), () => setCopied(false))}
        >
          Copiar instrucción
        </button>
        {copied && <span role="status"> Copiada.</span>}
      </details>

      {reviews.length > 0 && (
        <div className="table-scroll">
          <table className="review-table">
            <thead>
              <tr>
                <th scope="col">Criterio</th>
                {reviews.map((r, i) => <th key={i} scope="col">{r.reviewer.declaredName}<br /><span className="muted">{new Date(r.at).toLocaleDateString('es')}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {practice.rubric.map((c) => (
                <tr key={c.id} className={gaps.some((g) => g.id === c.id) ? 'review-table__gap' : undefined}>
                  <th scope="row">{c.name}</th>
                  {reviews.map((r, i) => {
                    const x = r.criteria.find((k) => k.criterionId === c.id)
                    return <td key={i} title={x?.evidenceQuote}>{x ? LEVEL_TEXT(x.level) : '—'}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {lastTwo.length === 2 && lastTwo[0].runId === lastTwo[1].runId && <p className="notice notice--info">Las dos últimas revisiones son de la misma corrida, así que no son independientes. Pide otra en una conversación nueva.</p>}
      {gaps.length > 0 && <p className="notice notice--info">Las dos últimas revisiones discrepan más de un nivel en: {gaps.map((g) => g.name).join(', ')}. Hace falta otra revisión para desempatar.</p>}

      <fieldset className="form-group" disabled={saving}>
        <legend>Registrar una revisión</legend>
        <div className="form-row">
          <label>Quién revisó <input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} /></label>
          <label>Tipo
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="external-assisted">Herramienta de IA</option>
              <option value="human">Persona</option>
            </select>
          </label>
          {type === 'external-assisted' && <label>Modelo <small>(opcional, tal como lo indique la herramienta)</small> <input value={model} maxLength={120} onChange={(e) => setModel(e.target.value)} /></label>}
        </div>
        {reviews.length > 0 && (
          <label className="check"><input type="checkbox" checked={sameRun} onChange={(e) => setSameRun(e.target.checked)} /> La hice en la misma conversación que la revisión anterior</label>
        )}
        {practice.rubric.map((c) => (
          <div key={c.id} className="self-row">
            <p><strong>{c.name}</strong>{c.critical && <span className="badge">Crítico</span>}</p>
            <label>Cita de evidencia que dio el revisor <textarea rows={2} maxLength={2000} value={crit[c.id]?.quote ?? ''} onChange={(e) => { const quote = e.target.value; setCrit((prev) => ({ ...prev, [c.id]: { level: prev[c.id]?.level ?? '', quote } })) }} /></label>
            <label>Nivel
              <select value={String(crit[c.id]?.level ?? '')} onChange={(e) => { const v = e.target.value; setCrit((prev) => ({ ...prev, [c.id]: { quote: prev[c.id]?.quote ?? '', level: v === '' ? '' : v === 'insufficient-evidence' ? 'insufficient-evidence' : (Number(v) as Level) } })) }}>
                <option value="">Sin elegir</option>
                {c.levels.map((l) => <option key={l.level} value={l.level}>{l.level}</option>)}
                <option value="insufficient-evidence">Evidencia insuficiente</option>
              </select>
            </label>
          </div>
        ))}
        <button type="button" className="button button--primary" disabled={!name.trim() || !complete} onClick={save}>Registrar revisión</button>
        {status && <p role="status">{status}</p>}
      </fieldset>
    </section>
  )
}


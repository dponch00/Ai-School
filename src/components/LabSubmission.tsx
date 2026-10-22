import { useState } from 'react'
import type { Practice } from '../domain/content'
import type { PracticeSubmission } from '../domain/learner'
import { db } from '../storage/db'
import { getSubmission, saveSubmission, type SubmissionDraft } from '../storage/learner'
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
  return loaded ? <SubmissionForm practice={practice} stored={loaded.stored} /> : null
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
              <textarea rows={3} maxLength={4000} value={notebook[k]} onChange={(e) => setNotebook({ ...notebook, [k]: e.target.value })} />
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
            <label>Evidencia que citas <textarea rows={2} maxLength={2000} value={self[c.id]?.evidence ?? ''} onChange={(e) => setSelf({ ...self, [c.id]: { level: self[c.id]?.level ?? '', evidence: e.target.value } })} /></label>
            <label>Nivel
              <select value={String(self[c.id]?.level ?? '')} onChange={(e) => setSelf({ ...self, [c.id]: { evidence: self[c.id]?.evidence ?? '', level: e.target.value === '' ? '' : e.target.value === 'insufficient-evidence' ? 'insufficient-evidence' : (Number(e.target.value) as Level) } })}>
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

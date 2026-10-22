import { useState } from 'react'
import LessonBlocks from '../components/LessonBlocks'
import { content, type MicrotaskView } from '../content'
import type { Attempt, PracticeSubmission, Response } from '../domain/learner'
import { finalSelection } from '../domain/learner'
import type { BlockSignal } from '../domain/scoring'
import { db } from '../storage/db'
import { blockResults, diagnosticAttempts, getMicrotask, saveMicrotask, splitMicrotaskText, startDiagnostic, type BlockResult } from '../storage/diagnostic'
import { useLive } from '../storage/useLive'
import { ExamForm } from './ExamPage'

type Level = PracticeSubmission['selfAssessment'][number]['level']

const SIGNAL: Record<BlockSignal, { label: string; advice: (manuals: string) => string }> = {
  'likely-strength': { label: 'Fortaleza probable', advice: (m) => `En ${m} puedes avanzar más rápido: usa la comprobación rápida al inicio de cada lección y salta lo que ya dominas.` },
  'review-recommended': { label: 'Conviene repasar', advice: (m) => `Dale prioridad a ${m} y lee sus lecciones completas.` },
  'no-clear-signal': { label: 'Sin señal clara', advice: (m) => `Sigue ${m} en el orden normal; las comprobaciones de cada lección afinarán la señal.` },
  'incomplete-evidence': { label: 'Evidencia incompleta', advice: () => 'No respondiste las cuatro preguntas del bloque, así que no hay señal. Puedes repetir el diagnóstico cuando quieras.' },
}

const manualsOf = (competencyIds: string[]) =>
  [...new Set(competencyIds.map((c) => content.competencies[c]?.primaryCourse).filter(Boolean))].map((m) => m!.toUpperCase()).join(' y ')

/** Diagnóstico inicial (F2-06, D-015): señales por bloque, nunca niveles ni porcentajes. */
export default function DiagnosticPage() {
  const { form, microtasks } = content.diagnostic
  const attempts = useLive(() => diagnosticAttempts(db), [], null as Attempt[] | null)
  const [error, setError] = useState<string | null>(null)
  if (!attempts) return null
  const open = attempts.find((a) => a.status === 'in-progress')
  const last = attempts.filter((a) => a.status === 'submitted').at(-1)

  const begin = async () => {
    setError(null)
    try {
      await startDiagnostic(db, form, content.questions)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="page page--reader">
      <article className="exam">
        <h1>Diagnóstico inicial</h1>
        {open ? (
          <>
            <p className="muted">24 preguntas en 6 bloques. No verás si aciertas hasta el final. Si dudas, marca tu seguridad: ayuda a interpretar la señal.</p>
            <ExamForm attempt={open} onSubmitted={() => window.scrollTo(0, 0)} />
          </>
        ) : (
          <>
            <p className="lead">{form.purpose}</p>
            <ul>
              <li>Unos 25 minutos, más dos microtareas opcionales de 10 minutos.</li>
              <li>El resultado es una señal por bloque (fortaleza probable, conviene repasar o sin señal clara), con los conteos a la vista. No es una calificación.</li>
              <li>Puedes repetirlo cuando quieras; cada lección y cada examen lo van corrigiendo.</li>
            </ul>
            <button type="button" className="button button--primary" onClick={begin}>{last ? 'Repetir el diagnóstico' : 'Empezar el diagnóstico'}</button>
            {error && <p className="question__error" role="alert">{error}</p>}
            {last && <Results attempt={last} microtasks={microtasks} />}
          </>
        )}
      </article>
    </div>
  )
}

function Results({ attempt, microtasks }: { attempt: Attempt; microtasks: MicrotaskView[] }) {
  const { form } = content.diagnostic
  const data = useLive(
    async () => ({
      responses: await db.responses.where('attemptId').equals(attempt.id).toArray(),
      subs: await Promise.all(microtasks.map((m) => getMicrotask(db, m.id))),
    }),
    [attempt.id],
    null as { responses: Response[]; subs: (PracticeSubmission | undefined)[] } | null,
  )
  if (!data) return null
  const results = blockResults(form, attempt, data.responses, microtasks.map((task, i) => ({ task, submission: data.subs[i] })))

  return (
    <>
      <section className="section" aria-labelledby="senales">
        <h2 id="senales">Tus señales por bloque</h2>
        <p className="muted">Del {new Date(attempt.submittedAt!).toLocaleDateString('es', { day: 'numeric', month: 'long' })}. Con cuatro preguntas por bloque son señales, no niveles: los conteos están a la vista para que juzgues tú también.</p>
        <div className="dx-blocks">
          {results.map((r) => <BlockCard key={r.blockId} r={r} />)}
        </div>
      </section>

      <section className="section" aria-labelledby="microtareas">
        <h2 id="microtareas">Microtareas (opcionales)</h2>
        <p className="muted">Dos tareas cortas de escribir. Tu autoevaluación de sus criterios críticos afina la señal de su bloque; queda marcada como autoevaluación, no como revisión.</p>
        {microtasks.map((m, i) => <MicrotaskForm key={m.id} task={m} stored={data.subs[i]} />)}
      </section>

      <details className="model-answer">
        <summary>Revisar las 24 preguntas</summary>
        {attempt.items.map((it, i) => {
          const r = data.responses.find((x) => x.questionId === it.question.id)
          const chosen = r ? finalSelection(r) : null
          const key = it.question.options.find((o) => o.correct)!
          const picked = it.question.options.find((o) => o.id === chosen)
          return (
            <div key={it.question.id} className="question">
              <p className="question__label">Pregunta {i + 1} · {form.blocks.find((b) => b.id === it.question.diagnosticBlock)?.name}{chosen === null ? ' · sin responder' : chosen === key.id ? ' · correcta' : ' · incorrecta'}</p>
              <p className="question__scenario">{it.question.scenario}</p>
              <p className="question__stem">{it.question.stem}</p>
              {picked && picked.id !== key.id && <p className="option__feedback"><strong>Tu respuesta: </strong>{picked.text}. {picked.feedback}</p>}
              <p className="option__feedback"><strong>La mejor opción: </strong>{key.text}. {key.feedback.replace(/^Correcta\.\s*/, '')}</p>
            </div>
          )
        })}
      </details>
    </>
  )
}

function BlockCard({ r }: { r: BlockResult }) {
  const s = SIGNAL[r.signal]
  const manuals = manualsOf(r.competencyIds)
  return (
    <div className={`dx-block dx-block--${r.signal}`}>
      <h3>{r.name}</h3>
      <p className="dx-block__signal">{s.label}</p>
      <p className="muted">
        {r.correct} de {r.total} correctas (base {r.baseCorrect} de 2, avanzadas {r.advancedCorrect} de 2)
        {r.highConfidenceErrors > 0 ? ` · ${r.highConfidenceErrors} ${r.highConfidenceErrors === 1 ? 'error' : 'errores'} con mucha seguridad` : ''}
      </p>
      {r.microtask && (
        <p className="muted">
          Microtarea «{r.microtask.title}»: {r.microtask.criticalOk === undefined ? 'sin hacer' : r.microtask.criticalOk ? 'criterios críticos cumplidos según tu autoevaluación' : 'algún criterio crítico sin cumplir según tu autoevaluación'}.
        </p>
      )}
      <p>{s.advice(manuals)}</p>
    </div>
  )
}

function MicrotaskForm({ task, stored }: { task: MicrotaskView; stored?: PracticeSubmission }) {
  const initial = stored ? splitMicrotaskText(stored.text) : { firstAnswer: '', taskAnswer: '' }
  const [first, setFirst] = useState(initial.firstAnswer)
  const [answer, setAnswer] = useState(initial.taskAnswer)
  const [self, setSelf] = useState<Record<string, { level: Level | ''; evidence: string }>>(
    () => Object.fromEntries((stored?.selfAssessment ?? []).map((s) => [s.criterionId, { level: s.level, evidence: s.evidence }])),
  )
  const [status, setStatus] = useState<string | null>(null)

  const save = async () => {
    try {
      const saved = await saveMicrotask(db, task, {
        firstAnswer: first,
        taskAnswer: answer,
        selfAssessment: task.rubric
          .filter((c) => self[c.id]?.level && self[c.id]?.evidence.trim())
          .map((c) => ({ criterionId: c.id, level: self[c.id].level as Level, evidence: self[c.id].evidence })),
      })
      setStatus(saved.state === 'presented' ? 'Guardada. Para que afine la señal, autoevalúa cada criterio con nivel y evidencia.' : 'Guardada y autoevaluada: la señal de su bloque ya la tiene en cuenta.')
    } catch (e) {
      setStatus(`No se pudo guardar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <details className="model-answer form-page" open={!stored}>
      <summary>{task.title} · {task.estimatedMinutes} min</summary>
      <LessonBlocks blocks={task.materialBlocks} sources={[]} />
      <label>{task.firstQuestion}
        <textarea rows={3} maxLength={4000} value={first} onChange={(e) => setFirst(e.target.value)} />
      </label>
      <label>{task.task}
        <textarea rows={8} maxLength={12000} value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </label>
      <fieldset className="form-group">
        <legend>Autoevaluación</legend>
        <p className="muted">Primero cita la parte de tu respuesta que lo demuestra; después elige el nivel.</p>
        {task.rubric.map((c) => (
          <div key={c.id} className="self-row">
            <p><strong>{c.name}</strong>{c.critical && <span className="badge">Crítico</span>}</p>
            <label>Evidencia <textarea rows={2} maxLength={2000} value={self[c.id]?.evidence ?? ''} onChange={(e) => { const evidence = e.target.value; setSelf((p) => ({ ...p, [c.id]: { level: p[c.id]?.level ?? '', evidence } })) }} /></label>
            <label>Nivel
              <select value={String(self[c.id]?.level ?? '')} onChange={(e) => { const v = e.target.value; setSelf((p) => ({ ...p, [c.id]: { evidence: p[c.id]?.evidence ?? '', level: v === '' ? '' : v === 'insufficient-evidence' ? 'insufficient-evidence' : (Number(v) as Level) } })) }}>
                <option value="">Sin elegir</option>
                {c.levels.map((l) => <option key={l.level} value={l.level}>{l.level} · {l.descriptor}</option>)}
                <option value="insufficient-evidence">Evidencia insuficiente</option>
              </select>
            </label>
          </div>
        ))}
      </fieldset>
      <button type="button" className="button button--primary" disabled={!first.trim() || !answer.trim()} onClick={save}>Guardar microtarea</button>
      {status && <p role="status">{status}</p>}
      {stored && (
        <details className="model-answer">
          <summary>Ver ejemplos de respuesta lograda e insuficiente</summary>
          <p><strong>Lograda:</strong> {task.anchors.achieved}</p>
          <p><strong>Insuficiente:</strong> {task.anchors.insufficient}</p>
        </details>
      )}
    </details>
  )
}

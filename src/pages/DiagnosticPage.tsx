import { useState } from 'react'
import { content } from '../content'
import type { Attempt, Response } from '../domain/learner'
import { finalSelection } from '../domain/learner'
import type { BlockSignal } from '../domain/scoring'
import { db } from '../storage/db'
import { blockResults, diagnosticAttempts, startDiagnostic, type BlockResult } from '../storage/diagnostic'
import { useLive } from '../storage/useLive'
import { ExamForm } from './ExamPage'

const SIGNAL: Record<BlockSignal, { label: string; advice: (manuals: string) => string }> = {
  'likely-strength': { label: 'Fortaleza probable', advice: (m) => `En ${m}, empieza cada lección con la comprobación rápida; si te cuesta, sigue la lección completa. Con cuatro preguntas es una señal, no una certeza.` },
  'review-recommended': { label: 'Conviene repasar', advice: (m) => `Dale prioridad a ${m} y lee sus lecciones completas.` },
  'no-clear-signal': { label: 'Sin señal clara', advice: (m) => `Sigue ${m} en el orden normal; las comprobaciones de cada lección afinarán la señal.` },
  'incomplete-evidence': { label: 'Evidencia incompleta', advice: () => 'No respondiste las cuatro preguntas del bloque, así que no hay señal. Puedes repetir el diagnóstico cuando quieras.' },
}

const manualsOf = (competencyIds: string[]) =>
  [...new Set(competencyIds.map((c) => content.competencies[c]?.primaryCourse).filter(Boolean))].map((m) => m!.toUpperCase()).join(' y ')

/** Diagnóstico inicial (F2-06, D-015): señales por bloque, nunca niveles ni porcentajes. */
export default function DiagnosticPage() {
  const { form } = content.diagnostic
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
            <p className="muted">24 preguntas en 6 bloques. No verás si aciertas hasta el final. Si estás muy seguro de una respuesta, márcalo: ayuda a interpretar la señal.</p>
            <ExamForm attempt={open} onSubmitted={() => window.scrollTo(0, 0)} />
          </>
        ) : (
          <>
            <p className="lead">{form.purpose}</p>
            <ul>
              <li>Unos 25 minutos, todo de opción múltiple.</li>
              <li>El resultado es una señal por bloque (fortaleza probable, conviene repasar o sin señal clara), con los conteos a la vista. No es una calificación.</li>
              <li>Puedes repetirlo cuando quieras; cada lección y cada examen lo van corrigiendo.</li>
            </ul>
            <button type="button" className="button button--primary" onClick={begin}>{last ? 'Repetir el diagnóstico' : 'Empezar el diagnóstico'}</button>
            {error && <p className="question__error" role="alert">{error}</p>}
            {last && <Results attempt={last} />}
          </>
        )}
      </article>
    </div>
  )
}

function Results({ attempt }: { attempt: Attempt }) {
  const { form } = content.diagnostic
  const data = useLive(
    async () => ({ responses: await db.responses.where('attemptId').equals(attempt.id).toArray() }),
    [attempt.id],
    null as { responses: Response[] } | null,
  )
  if (!data) return null
  const results = blockResults(form, attempt, data.responses)

  return (
    <>
      <section className="section" aria-labelledby="senales">
        <h2 id="senales">Tus señales por bloque</h2>
        <p className="muted">Del {new Date(attempt.submittedAt!).toLocaleDateString('es', { day: 'numeric', month: 'long' })}. Con cuatro preguntas por bloque son señales, no niveles: los conteos están a la vista para que juzgues tú también.</p>
        <div className="dx-blocks">
          {results.map((r) => <BlockCard key={r.blockId} r={r} />)}
        </div>
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
      <p>{s.advice(manuals)}</p>
    </div>
  )
}

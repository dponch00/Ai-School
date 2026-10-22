import { useId, useState } from 'react'
import { Link, useParams } from 'react-router'
import { content, getCourse } from '../content'
import type { Attempt, ItemSnapshot, Response } from '../domain/learner'
import { finalSelection } from '../domain/learner'
import { db } from '../storage/db'
import { ITEMS_PER_OBJECTIVE, examAttempts, selectExamAnswer, startExam, submitExam } from '../storage/exam'
import { useLive } from '../storage/useLive'
import NotFound from './NotFound'

const dateTime = (iso: string) => new Date(iso).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function useResponses(attemptId: string | undefined): Response[] {
  return useLive(() => (attemptId ? db.responses.where('attemptId').equals(attemptId).toArray() : Promise.resolve([])), [attemptId], [])
}

export default function ExamPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const attempts = useLive(() => examAttempts(db, course?.id ?? ''), [course?.id], null as Attempt[] | null)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!course) return <NotFound />
  const bank = Object.values(content.questions).filter((q) => q.use === 'exam' && q.courseId === course.id)
  const open = attempts?.find((a) => a.status === 'in-progress')
  const submitted = (attempts ?? []).filter((a) => a.status === 'submitted')
  const reviewing = reviewId ? submitted.find((a) => a.id === reviewId) : undefined

  const begin = async () => {
    setError(null)
    try {
      await startExam(db, { id: course.id, version: course.version, evaluatedObjectiveIds: course.evaluatedObjectives.map((o) => o.id), pilot: course.status !== 'published' }, bank)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="page page--reader">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/cursos/${course.id}`}>{course.id.toUpperCase()}</Link> <span aria-hidden="true">/</span> Examen
      </nav>
      <article className="exam">
        <h1>Examen de {course.id.toUpperCase()}</h1>
        {attempts === null ? null : open ? (
          <ExamForm attempt={open} onSubmitted={(id) => setReviewId(id)} />
        ) : reviewing ? (
          <ExamReview attempt={reviewing} courseId={course.id} objectives={course.evaluatedObjectives} onBack={() => setReviewId(null)} />
        ) : (
          <>
            <section className="exam__intro">
              <p className="lead">
                {course.evaluatedObjectives.length * ITEMS_PER_OBJECTIVE} preguntas, {ITEMS_PER_OBJECTIVE} por cada objetivo del manual. Apruebas con 10 correctas y sin dejar ningún objetivo con todas sus preguntas falladas.
              </p>
              {course.status !== 'published' && (
                <p className="checks__last">Examen piloto: las preguntas todavía están en revisión y pueden cambiar. Tus intentos guardan la versión exacta que respondiste.</p>
              )}
              <ul>
                <li>No verás si aciertas hasta enviarlo. Antes de enviar puedes cambiar cualquier respuesta.</li>
                <li>Cada respuesta se guarda al elegirla: si cierras la app, el examen te espera donde lo dejaste.</li>
                <li>Si repites el examen, las preguntas que fallaste vuelven con otro escenario, no con las opciones reordenadas.</li>
              </ul>
              <button type="button" className="button button--primary" onClick={begin}>
                {submitted.length === 0 ? 'Empezar el examen' : 'Hacer un nuevo intento'}
              </button>
              {error && <p className="question__error" role="alert">No se pudo armar el examen: {error}</p>}
            </section>
            {submitted.length > 0 && (
              <section className="section" aria-labelledby="intentos">
                <h2 id="intentos">Tus intentos</h2>
                <ol className="lesson-list">
                  {[...submitted].reverse().map((a) => (
                    <li key={a.id}>
                      <button type="button" className="lesson-list__link exam__attempt" onClick={() => setReviewId(a.id)}>
                        <span className="lesson-list__order" aria-hidden="true">{a.result?.passed ? '✓' : '✗'}</span>
                        <span className="lesson-list__title">
                          {a.result?.passed ? 'Aprobado' : 'No aprobado'} · {a.result?.correct} de {a.result?.total}
                          <span className="lesson-list__status">{dateTime(a.submittedAt!)} · ver la revisión</span>
                        </span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}
      </article>
    </div>
  )
}

function ExamForm({ attempt, onSubmitted }: { attempt: Attempt; onSubmitted: (id: string) => void }) {
  const responses = useResponses(attempt.id)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selected = (qid: string) => {
    const r = responses.find((x) => x.questionId === qid)
    return r ? finalSelection(r) : null
  }
  const answered = attempt.items.filter((it) => selected(it.question.id) !== null).length
  const missing = attempt.items.length - answered

  const choose = (qid: string, oid: string) =>
    selectExamAnswer(db, attempt.id, qid, oid).catch((e) => setError(e instanceof Error ? e.message : String(e)))

  const send = async () => {
    if (missing > 0 && !confirming) {
      setConfirming(true)
      return
    }
    try {
      const done = await submitExam(db, attempt.id)
      onSubmitted(done.id)
      window.scrollTo(0, 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <>
      <p className="exam__progress" role="status">Respondidas {answered} de {attempt.items.length}. Se guardan al elegirlas.</p>
      {attempt.items.map((it, i) => (
        <ExamQuestion key={it.question.id} item={it} n={i + 1} total={attempt.items.length} selected={selected(it.question.id)} onChoose={(oid) => choose(it.question.id, oid)} />
      ))}
      {error && <p className="question__error" role="alert">{error}</p>}
      {confirming && missing > 0 && (
        <p className="question__error" role="alert">
          Te {missing === 1 ? 'falta 1 pregunta' : `faltan ${missing} preguntas`}. Si envías ahora, cuentan como no acertadas.
        </p>
      )}
      <button type="button" className="button button--primary" onClick={send}>
        {confirming && missing > 0 ? 'Enviar de todos modos' : 'Enviar el examen'}
      </button>
    </>
  )
}

function ExamQuestion({ item, n, total, selected, onChoose }: { item: ItemSnapshot; n: number; total: number; selected: string | null; onChoose: (id: string) => void }) {
  const groupId = useId()
  const byId = new Map(item.question.options.map((o) => [o.id, o]))
  return (
    <fieldset className="question" aria-describedby={`${groupId}-scenario ${groupId}-stem`}>
      <legend className="question__label">Pregunta {n} de {total}</legend>
      <p id={`${groupId}-scenario`} className="question__scenario">{item.question.scenario}</p>
      <p id={`${groupId}-stem`} className="question__stem">{item.question.stem}</p>
      <div className="question__options">
        {item.shownOptionIds.map((id) => (
          <div key={id} className="option option--open">
            <label className="option__label">
              <input type="radio" name={groupId} value={id} checked={selected === id} onChange={() => onChoose(id)} />
              <span>{byId.get(id)!.text}</span>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

interface ReviewProps {
  attempt: Attempt
  courseId: string
  objectives: { id: string; statement: string }[]
  onBack: () => void
}

function ExamReview({ attempt, courseId, objectives, onBack }: ReviewProps) {
  const responses = useResponses(attempt.id)
  const result = attempt.result
  const pick = (qid: string) => {
    const r = responses.find((x) => x.questionId === qid)
    return r ? finalSelection(r) : null
  }
  const byObjective = objectives.map((o) => {
    const items = attempt.items.filter((it) => it.question.evaluatedObjectiveId === o.id)
    const ok = items.filter((it) => pick(it.question.id) === it.question.options.find((x) => x.correct)?.id).length
    return { ...o, ok, total: items.length }
  })

  return (
    <>
      <section className={`exam__result exam__result--${result?.passed ? 'pass' : 'fail'}`} aria-labelledby="resultado">
        <h2 id="resultado">{result?.passed ? 'Aprobado' : 'Todavía no aprobado'}: {result?.correct} de {result?.total}</h2>
        <p className="muted">Enviado el {dateTime(attempt.submittedAt!)}. Regla: al menos {result?.rule.minCorrect} correctas{result?.rule.requireEachObjective ? ' y ningún objetivo con todas sus preguntas falladas' : ''}.</p>
        {result && result.reasons.length > 0 && (
          <ul>{result.reasons.map((r) => <li key={r}>{capitalize(r).replace(/objetivo (m\d\d-eo\d)/, (_, id) => `objetivo «${objectives.find((o) => o.id === id)?.statement ?? id}»`)}</li>)}</ul>
        )}
      </section>

      <section className="section" aria-labelledby="por-objetivo">
        <h2 id="por-objetivo">Por objetivo</h2>
        <ul className="exam__objectives">
          {byObjective.map((o) => (
            <li key={o.id} className={o.ok === 0 ? 'exam__objective--zero' : undefined}>
              <strong>{o.ok} de {o.total}</strong> · {o.statement}
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="revision">
        <h2 id="revision">Revisión pregunta por pregunta</h2>
        {attempt.items.map((it, i) => {
          const chosen = pick(it.question.id)
          const byId = new Map(it.question.options.map((o) => [o.id, o]))
          const [lessonId, anchor] = it.question.sectionRef.split('#')
          return (
            <div key={it.question.id} className="question">
              <p className="question__label">Pregunta {i + 1}{chosen === null ? ' · sin responder' : ''}</p>
              <p className="question__scenario">{it.question.scenario}</p>
              <p className="question__stem">{it.question.stem}</p>
              <div className="question__options">
                {it.shownOptionIds.map((id) => {
                  const o = byId.get(id)!
                  const state = o.correct ? 'correct' : id === chosen ? 'wrong' : 'other'
                  return (
                    <div key={id} className={`option option--${state}`}>
                      <p className="option__label">
                        <span aria-hidden="true">{o.correct ? '✓' : id === chosen ? '✗' : '·'}</span>
                        <span>
                          {o.text}
                          {id === chosen && <span className="visually-hidden"> (tu respuesta)</span>}
                          {o.correct && <span className="visually-hidden"> (respuesta correcta)</span>}
                        </span>
                      </p>
                      {(o.correct || id === chosen) && (
                        <p className="option__feedback">
                          <strong>{o.correct ? (id === chosen ? 'Tu respuesta, correcta. ' : 'La mejor opción. ') : 'Tu respuesta. '}</strong>
                          {o.feedback.replace(/^Correcta\.\s*/, '')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="question__ref">
                <Link to={`/cursos/${courseId}/lecciones/${lessonId}?seccion=${anchor}`}>Repasar el apartado en su lección</Link>
              </p>
            </div>
          )
        })}
      </section>
      <button type="button" className="button" onClick={onBack}>Volver al examen</button>
    </>
  )
}

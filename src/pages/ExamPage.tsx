import { useId, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCourse, useCoursePackage } from '../content'
import type { Attempt, ItemSnapshot, Response } from '../domain/learner'
import { finalSelection } from '../domain/learner'
import { db } from '../storage/db'
import {
  ITEMS_PER_OBJECTIVE,
  RETENTION_DAYS,
  assessmentAttempts,
  retentionStatus,
  retryGate,
  selectExamAnswer,
  setExamConfidence,
  startExam,
  startRetention,
  submitExam,
  type ExamCourse,
} from '../storage/exam'
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
  const { pkg, error: pkgError } = useCoursePackage(course?.id)
  const id = course?.id ?? ''
  const attempts = useLive(() => assessmentAttempts(db, id), [id], null as Attempt[] | null)
  const gate = useLive(() => retryGate(db, id), [id], null as Awaited<ReturnType<typeof retryGate>> | null)
  const retention = useLive(() => retentionStatus(db, id), [id], null as Awaited<ReturnType<typeof retentionStatus>> | null)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!course) return <NotFound />
  const bank = pkg ? Object.values(pkg.questions).filter((q) => q.use === 'exam' && q.courseId === course.id) : []
  const examCourse: ExamCourse = { id: course.id, version: course.version, evaluatedObjectiveIds: course.evaluatedObjectives.map((o) => o.id), pilot: course.status !== 'published' }
  const open = attempts?.find((a) => a.status === 'in-progress')
  const submitted = (attempts ?? []).filter((a) => a.status === 'submitted')
  const exams = submitted.filter((a) => a.kind === 'exam')
  const reviewing = reviewId ? submitted.find((a) => a.id === reviewId) : undefined
  const lessonTitle = (lessonId: string) => course.lessons.find((l) => l.id === lessonId)?.title ?? lessonId

  const run = async (fn: () => Promise<unknown>) => {
    setError(null)
    // Las preguntas viajan en el paquete del curso (F2-05): sin él no se puede armar un examen nuevo.
    if (!pkg) {
      setError(pkgError ?? 'Cargando las preguntas del curso…')
      return
    }
    try {
      await fn()
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
        <h1>{open?.kind === 'retention' ? 'Comprobación de retención' : `Examen de ${course.id.toUpperCase()}`}</h1>
        {attempts === null || gate === null || retention === null ? null : open ? (
          <ExamForm attempt={open} onSubmitted={(sent) => setReviewId(sent)} />
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
                <li>No verás si aciertas hasta enviarlo. Antes de enviar puedes cambiar cualquier respuesta y, si quieres, marcar qué tan seguro estás.</li>
                <li>Cada respuesta se guarda al elegirla: si cierras la app, el examen te espera donde lo dejaste.</li>
                <li>Si no apruebas, el reintento se habilita al día siguiente y después de repasar las lecciones de las preguntas que fallaste, respondiendo otra vez sus comprobaciones. Cada pregunta del reintento es una variante que no has visto.</li>
              </ul>

              {gate.reason === 'first' && <button type="button" className="button button--primary" disabled={!pkg} onClick={() => run(() => startExam(db, examCourse, bank))}>{pkg ? 'Empezar el examen' : 'Cargando las preguntas…'}</button>}
              {gate.reason === 'ok' && <button type="button" className="button button--primary" disabled={!pkg} onClick={() => run(() => startExam(db, examCourse, bank))}>Hacer el reintento</button>}
              {(gate.reason === 'review' || gate.reason === 'wait') && (
                <div className="notice notice--info">
                  <p className="notice__title">Antes del reintento</p>
                  <ul className="exam__pending">
                    {gate.pending.map((p) => (
                      <li key={`${p.lessonId}#${p.anchor}`}>
                        <span aria-hidden="true">{p.done ? '✓' : '○'}</span>{' '}
                        <Link to={`/cursos/${course.id}/lecciones/${p.lessonId}?seccion=${p.anchor}`}>Repasar «{lessonTitle(p.lessonId)}»</Link>
                        <span className="muted"> · {p.done ? 'listo' : 'falta responder sus comprobaciones'}</span>
                      </li>
                    ))}
                    <li>
                      <span aria-hidden="true">{gate.reason === 'wait' ? '○' : '·'}</span> Disponible desde el {dateTime(gate.availableAt!)}
                    </li>
                  </ul>
                </div>
              )}
              {gate.reason === 'passed' && <p className="notice notice--info">Ya aprobaste el examen. El siguiente paso es la comprobación de retención.</p>}
              {error && <p className="question__error" role="alert">{error}</p>}
              {!error && pkgError && <p className="question__error" role="alert">{pkgError}</p>}
            </section>

            {retention.state !== 'not-passed' && (
              <section className="section" aria-labelledby="retencion">
                <h2 id="retencion">Comprobación de retención</h2>
                <p>
                  {RETENTION_DAYS} días después de aprobar, 6 preguntas que no has visto, una por objetivo. Con 5 correctas queda «retención comprobada». Es opcional y nunca quita el aprobado.
                </p>
                {retention.last?.result && (
                  <p className="checks__last">
                    La última, el {dateTime(retention.last.submittedAt!)}: {retention.last.result.correct} de {retention.last.result.total}, {retention.last.result.passed ? 'retención comprobada' : 'todavía sin comprobar'}.
                  </p>
                )}
                {retention.state === 'available' ? (
                  <button type="button" className="button button--primary" disabled={!pkg} onClick={() => run(() => startRetention(db, examCourse, bank))}>Empezar la comprobación</button>
                ) : (
                  <p className="muted">Disponible desde el {dateTime(retention.availableAt!)}.</p>
                )}
              </section>
            )}

            {submitted.length > 0 && (
              <section className="section" aria-labelledby="intentos">
                <h2 id="intentos">Tus intentos</h2>
                <ol className="lesson-list">
                  {[...submitted].reverse().map((a) => (
                    <li key={a.id}>
                      <button type="button" className="lesson-list__link exam__attempt" onClick={() => setReviewId(a.id)}>
                        <span className="lesson-list__order" aria-hidden="true">{a.result?.passed ? '✓' : '✗'}</span>
                        <span className="lesson-list__title">
                          {a.kind === 'retention' ? `Retención ${a.result?.passed ? 'comprobada' : 'sin comprobar'}` : a.result?.passed ? 'Aprobado' : 'No aprobado'} · {a.result?.correct} de {a.result?.total}
                          <span className="lesson-list__status">
                            {dateTime(a.submittedAt!)}
                            {a.kind === 'exam' && (exams[0]?.id === a.id ? ' · primer intento' : ' · reintento')} · ver la revisión
                          </span>
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

export function ExamForm({ attempt, onSubmitted }: { attempt: Attempt; onSubmitted: (id: string) => void }) {
  const responses = useResponses(attempt.id)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // La elección se muestra al instante; la base de datos la confirma unos milisegundos después.
  const [optimistic, setOptimistic] = useState<Record<string, string>>({})
  const response = (qid: string) => responses.find((x) => x.questionId === qid)
  const selected = (qid: string) => {
    if (optimistic[qid]) return optimistic[qid]
    const r = response(qid)
    return r ? finalSelection(r) : null
  }
  const answered = attempt.items.filter((it) => selected(it.question.id) !== null).length
  const missing = attempt.items.length - answered
  const fail = (e: unknown) => setError(e instanceof Error ? e.message : String(e))

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
      fail(e)
    }
  }

  return (
    <>
      <p className="exam__progress" role="status">Respondidas {answered} de {attempt.items.length}. Se guardan al elegirlas.</p>
      {attempt.items.map((it, i) => (
        <ExamQuestion
          key={it.question.id}
          item={it}
          n={i + 1}
          total={attempt.items.length}
          selected={selected(it.question.id)}
          confidence={response(it.question.id)?.confidence}
          onChoose={(oid) => {
            setOptimistic((prev) => ({ ...prev, [it.question.id]: oid }))
            selectExamAnswer(db, attempt.id, it.question.id, oid).catch(fail)
          }}
          onConfidence={(c) => setExamConfidence(db, attempt.id, it.question.id, c).catch(fail)}
        />
      ))}
      {error && <p className="question__error" role="alert">{error}</p>}
      {confirming && missing > 0 && (
        <p className="question__error" role="alert">
          Te {missing === 1 ? 'falta 1 pregunta' : `faltan ${missing} preguntas`}. Si envías ahora, cuentan como no acertadas.
        </p>
      )}
      <button type="button" className="button button--primary" onClick={send}>
        {confirming && missing > 0 ? 'Enviar de todos modos' : 'Enviar'}
      </button>
    </>
  )
}

interface QuestionProps {
  item: ItemSnapshot
  n: number
  total: number
  selected: string | null
  confidence: Response['confidence']
  onChoose: (id: string) => void
  onConfidence: (c: Response['confidence'] | undefined) => void
}

function ExamQuestion({ item, n, total, selected, confidence, onChoose, onConfidence }: QuestionProps) {
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
      {selected && (
        <label className="question__confidence">
          <input type="checkbox" checked={confidence === 'high'} onChange={(e) => onConfidence(e.target.checked ? 'high' : undefined)} />
          <span>Estoy muy seguro <span className="muted">(opcional; si fallas, la pregunta vuelve en el repaso de errores)</span></span>
        </label>
      )}
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
  const retention = attempt.kind === 'retention'
  const response = (qid: string) => responses.find((x) => x.questionId === qid)
  const pick = (qid: string) => {
    const r = response(qid)
    return r ? finalSelection(r) : null
  }
  const byObjective = objectives.map((o) => {
    const items = attempt.items.filter((it) => it.question.evaluatedObjectiveId === o.id)
    const ok = items.filter((it) => pick(it.question.id) === it.question.options.find((x) => x.correct)?.id).length
    return { ...o, ok, total: items.length }
  })
  const title = retention ? (result?.passed ? 'Retención comprobada' : 'Retención todavía sin comprobar') : result?.passed ? 'Aprobado' : 'Todavía no aprobado'
  const confident = attempt.items.filter((it) => response(it.question.id)?.confidence === 'high' && pick(it.question.id) !== it.question.options.find((x) => x.correct)?.id).length

  return (
    <>
      <section className={`exam__result exam__result--${result?.passed ? 'pass' : 'fail'}`} aria-labelledby="resultado">
        <h2 id="resultado">{title}: {result?.correct} de {result?.total}</h2>
        <p className="muted">Enviado el {dateTime(attempt.submittedAt!)}. Regla: al menos {result?.rule.minCorrect} correctas{result?.rule.requireEachObjective ? ' y ningún objetivo con todas sus preguntas falladas' : ''}.</p>
        {result && result.reasons.length > 0 && (
          <ul>{result.reasons.map((r) => <li key={r}>{capitalize(r).replace(/objetivo (m\d\d-eo\d)/, (_, oid) => `objetivo «${objectives.find((o) => o.id === oid)?.statement ?? oid}»`)}</li>)}</ul>
        )}
        {confident > 0 && <p>En {confident} {confident === 1 ? 'pregunta' : 'preguntas'} estabas muy seguro y no acertaste: son las primeras que conviene repasar.</p>}
      </section>

      <section className="section" aria-labelledby="por-objetivo">
        <h2 id="por-objetivo">Por objetivo</h2>
        <ul className="exam__objectives">
          {byObjective.filter((o) => o.total > 0).map((o) => (
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
          const conf = response(it.question.id)?.confidence
          const byId = new Map(it.question.options.map((o) => [o.id, o]))
          const [lessonId, anchor] = it.question.sectionRef.split('#')
          return (
            <div key={it.question.id} className="question">
              <p className="question__label">
                Pregunta {i + 1}
                {chosen === null ? ' · sin responder' : ''}
                {conf === 'high' ? ' · marcaste «Estoy muy seguro»' : ''}
              </p>
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

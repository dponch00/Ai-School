import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { content, getCourse, getLesson, useCoursePackage } from '../content'
import LessonBlocks from '../components/LessonBlocks'
import { scrollToAnchor } from '../components/anchors'
import QuestionCheck from '../components/QuestionCheck'
import Toc from '../components/Toc'
import LessonNotes from '../components/LessonNotes'
import NotFound from './NotFound'
import { db } from '../storage/db'
import { lessonProgress, markLessonVisited } from '../storage/progress'
import { useCheckRound } from '../storage/useCheckRound'
import { useLive } from '../storage/useLive'

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' })

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const [params] = useSearchParams()
  const course = getCourse(courseId)
  const lesson = course && getLesson(course, lessonId)
  const target = params.get('seccion')
  const { pkg, error: pkgError } = useCoursePackage(course?.id)
  const body = lesson ? pkg?.lessons[lesson.id] : undefined
  const ids = { courseId: course?.id ?? '', lessonId: lesson?.id ?? '', contentVersion: course?.version ?? '0.0.0' }
  const recordCheck = useCheckRound({ ...ids, purpose: 'checks', size: lesson?.checkQuestionIds.length ?? 0 })
  const recordReview = useCheckRound({ ...ids, purpose: 'review', size: lesson?.reviewQuestionIds.length ?? 0 })
  // Marca el inicio de la visita para distinguir la ronda anterior de la que se acaba de responder.
  const [visitStart] = useState(() => new Date().toISOString())
  const progress = useLive(() => lessonProgress(db, ids.courseId, ids.lessonId), [ids.courseId, ids.lessonId], undefined)

  useEffect(() => {
    if (ids.lessonId) markLessonVisited(db, ids.courseId, ids.lessonId).catch((e) => console.warn('No se pudo guardar la visita', e))
  }, [ids.courseId, ids.lessonId])

  useEffect(() => {
    if (target && body) requestAnimationFrame(() => scrollToAnchor(target))
  }, [target, lessonId, body])

  if (!course || !lesson) return <NotFound />
  const index = course.lessons.indexOf(lesson)
  const prev = course.lessons[index - 1]
  const next = course.lessons[index + 1]
  const q = (id: string) => pkg?.questions[id]
  const sources = body?.sources ?? []

  return (
    <div className="page page--reader">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/cursos/${course.id}`}>{course.id.toUpperCase()}</Link> <span aria-hidden="true">/</span> Lección {lesson.order}
      </nav>
      <div className="reader">
        <Toc entries={lesson.toc} hasChecks hasSources={sources.length > 0} />
        <article className="reader__main" aria-labelledby="lesson-title">
          <p className="eyebrow">Lección {lesson.order} de {course.lessons.length} · {lesson.estimatedMinutes} min</p>
          <h1 id="lesson-title">{lesson.title}</h1>

          {!body && <p className="notice notice--info" role="status">{pkgError ?? 'Cargando la lección…'}</p>}
          {body && (
            <>

          {lesson.reviewQuestionIds.length > 0 && (
            <section className="review" aria-labelledby="repaso">
              <h2 id="repaso" className="review__title">Repaso antes de empezar</h2>
              <p className="muted">Responde sin mirar la lección anterior. Recordar es parte de aprender.</p>
              {lesson.reviewQuestionIds.map((id, i) => q(id) && (
                <QuestionCheck key={id} question={q(id)!} courseId={course.id} currentLessonId={lesson.id} label={`Repaso ${i + 1}`} onAnswer={recordReview} />
              ))}
            </section>
          )}

          <section className="objectives-box" aria-labelledby="objetivos-leccion">
            <h2 id="objetivos-leccion">En esta lección</h2>
            <ul>{lesson.objectives.map((o) => <li key={o.id}>{o.statement}</li>)}</ul>
          </section>

          <LessonBlocks
            blocks={body.blocks}
            productCards={pkg!.productCards}
            assets={pkg!.assets}
            sources={Object.values(content.sources)}
            checks={
              <section className="checks" aria-labelledby="comprobacion">
                <h2 id="comprobacion">Comprueba lo que aprendiste</h2>
                <p className="muted">Sin volver a leer. Después de responder verás por qué cada opción es o no la mejor.</p>
                {progress?.lastCheck && (
                  <p className="checks__last" role="status">
                    {progress.lastCheck.at < visitStart
                      ? `La última vez acertaste ${progress.lastCheck.correct} de ${progress.lastCheck.total} (${shortDate(progress.lastCheck.at)}). Las opciones cambian de orden en cada visita.`
                      : `Guardado: acertaste ${progress.lastCheck.correct} de ${progress.lastCheck.total}. La lección cuenta como completada.`}
                  </p>
                )}
                {lesson.checkQuestionIds.map((id, i) => q(id) && (
                  <QuestionCheck key={id} question={q(id)!} courseId={course.id} currentLessonId={lesson.id} label={`Pregunta ${i + 1} de ${lesson.checkQuestionIds.length}`} onAnswer={recordCheck} />
                ))}
              </section>
            }
          />

          {sources.length > 0 && (
            <section className="sources" aria-labelledby="fuentes">
              <h2 id="fuentes">Fuentes</h2>
              <ol>
                {sources.map((s) => (
                  <li key={s.id} id={`fuente-${s.n}`}>
                    <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>, {s.organization}. Consultada el {s.accessedAt}.
                  </li>
                ))}
              </ol>
            </section>
          )}

            </>
          )}

          <LessonNotes lessonId={lesson.id} />

          <nav className="pager" aria-label="Lecciones">
            {prev ? <Link to={`/cursos/${course.id}/lecciones/${prev.id}`}>← {prev.title}</Link> : <span />}
            {next ? (
              <Link to={`/cursos/${course.id}/lecciones/${next.id}`}>{next.title} →</Link>
            ) : (
              course.practice && <Link to={`/cursos/${course.id}/laboratorio`}>Laboratorio →</Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  )
}

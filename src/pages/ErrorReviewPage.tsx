import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCourse } from '../content'
import QuestionCheck from '../components/QuestionCheck'
import { errorReviewQueue, type ReviewItem } from '../domain/review-queue'
import { db } from '../storage/db'
import { now } from '../storage/progress'
import { useCheckRound } from '../storage/useCheckRound'
import { useLive } from '../storage/useLive'
import NotFound from './NotFound'

const date = (iso: string) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' })

/** Repaso de errores con confianza alta (R-E-4): vuelven al día siguiente y otra vez a los 7 días. */
export default function ErrorReviewPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const id = course?.id ?? ''
  const queue = useLive(
    async () => errorReviewQueue(await db.attempts.where('courseId').equals(id).toArray(), await db.responses.toArray(), id, now()),
    [id],
    null as ReturnType<typeof errorReviewQueue> | null,
  )
  if (!course) return <NotFound />
  return (
    <div className="page page--reader">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/cursos/${course.id}`}>{course.id.toUpperCase()}</Link> <span aria-hidden="true">/</span> Repaso de errores
      </nav>
      <article className="exam">
        <h1>Repaso de errores</h1>
        <p className="lead">
          Aquí vuelven las preguntas que fallaste estando muy seguro. Son las que más conviene repasar: vuelven al día siguiente y, si las aciertas, otra vez a los 7 días. Con dos aciertos seguidos salen de la lista.
        </p>
        {queue && <Session courseId={course.id} contentVersion={course.version} initial={queue.due} upcoming={queue.upcoming} resolved={queue.resolved} />}
      </article>
    </div>
  )
}

/** La sesión congela las preguntas de hoy al empezar: al responderlas, la cola cambia, pero la página no. */
function Session({ courseId, contentVersion, initial, upcoming, resolved }: { courseId: string; contentVersion: string; initial: ReviewItem[]; upcoming: ReviewItem[]; resolved: number }) {
  const [items] = useState(initial)
  const record = useCheckRound({ courseId, lessonId: courseId, purpose: 'errors', contentVersion, size: items.length })
  return (
    <>
      {items.length === 0 ? (
        <p className="notice notice--info">No tienes preguntas para repasar hoy.</p>
      ) : (
        items.map((it, i) => (
          <QuestionCheck
            key={it.questionId}
            question={it.question}
            courseId={courseId}
            label={`Repaso ${i + 1} de ${items.length} · ${it.streak === 0 ? 'primer repaso' : 'segundo repaso'}`}
            onAnswer={record}
          />
        ))
      )}
      {upcoming.length > 0 && (
        <p className="muted">
          Próximos: {upcoming.map((u) => date(u.dueAt)).join(', ')}.
        </p>
      )}
      {resolved > 0 && <p className="muted">Ya superaste {resolved} {resolved === 1 ? 'pregunta' : 'preguntas'} de esta lista.</p>}
    </>
  )
}

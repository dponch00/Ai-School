import { Link, useParams } from 'react-router'
import { covers, getCourse, imageSrcSet } from '../content'
import NotFound from './NotFound'
import { db } from '../storage/db'
import { courseProgress } from '../storage/progress'
import { examAttempts } from '../storage/exam'
import { useLive } from '../storage/useLive'

export default function CourseOverview() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const progress = useLive(() => courseProgress(db, course?.id ?? ''), [course?.id], [])
  const exams = useLive(() => examAttempts(db, course?.id ?? ''), [course?.id], [])
  const plan = useLive(() => db.adjustments.toArray(), [], [])
  if (!course) return <NotFound />
  const cover = covers[course.id]
  const status = (lessonId: string) => {
    const p = progress.find((x) => x.lessonId === lessonId)
    if (p?.lastCheck) return { label: `Completada · ${p.lastCheck.correct}/${p.lastCheck.total}`, kind: 'done' }
    if (p) return { label: 'Empezada', kind: 'started' }
    return null
  }
  const done = course.lessons.filter((l) => status(l.id)?.kind === 'done').length
  const lastExam = exams.filter((a) => a.status === 'submitted').at(-1)
  const passedExam = exams.find((a) => a.result?.passed)
  const examStatus = exams.some((a) => a.status === 'in-progress')
    ? 'En curso'
    : passedExam
      ? `Aprobado · ${passedExam.result!.correct}/${passedExam.result!.total}`
      : lastExam
        ? `No aprobado · ${lastExam.result!.correct}/${lastExam.result!.total}`
        : 'Pendiente'
  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span> {course.id.toUpperCase()}
      </nav>
      {cover && (
        <img className="course-cover" src={`/images/${cover}-960.webp`} srcSet={imageSrcSet(cover)} sizes="(min-width: 76rem) 76rem, 100vw" alt="" width={1600} height={900} />
      )}
      <h1>{course.title}</h1>
      <p className="lead">{course.centralQuestion}</p>

      <section className="section" aria-labelledby="objetivos">
        <h2 id="objetivos">Al terminar podrás</h2>
        <ul className="objectives">
          {course.evaluatedObjectives.map((o) => <li key={o.id}>{o.statement}</li>)}
        </ul>
      </section>

      <section className="section" aria-labelledby="lecciones">
        <h2 id="lecciones">Lecciones</h2>
        {progress.length > 0 && <p className="muted">Completaste {done} de {course.lessons.length}. Una lección cuenta como completada cuando respondes todas sus comprobaciones.</p>}
        <ol className="lesson-list">
          {course.lessons.map((l) => {
            const s = status(l.id)
            const inPlan = plan.some((a) => a.kind === 'review-lesson' && (a.state === 'accepted' || a.state === 'in-progress') && a.targetIds.includes(l.id))
            return (
              <li key={l.id}>
                <Link to={`/cursos/${course.id}/lecciones/${l.id}`} className="lesson-list__link">
                  <span className="lesson-list__order">{s?.kind === 'done' ? <span aria-hidden="true">✓</span> : l.order}</span>
                  <span className="lesson-list__title">
                    {l.title}
                    {s && <span className={`lesson-list__status lesson-list__status--${s.kind}`}>{s.label}</span>}
                    {inPlan && <span className="lesson-list__status lesson-list__status--plan">En tu ruta: repasar</span>}
                  </span>
                  <span className="lesson-list__time">{l.estimatedMinutes} min</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="section" aria-labelledby="practica">
        <h2 id="practica">Práctica y examen</h2>
        <ul className="lesson-list">
          {course.practice && (
            <li>
              <Link to={`/cursos/${course.id}/laboratorio`} className="lesson-list__link">
                <span className="lesson-list__order" aria-hidden="true">◆</span>
                <span className="lesson-list__title">Laboratorio: {course.practice.title}</span>
                <span className="lesson-list__time">75–90 min</span>
              </Link>
            </li>
          )}
          <li>
            <Link to={`/cursos/${course.id}/practica`} className="lesson-list__link">
              <span className="lesson-list__order" aria-hidden="true">◇</span>
              <span className="lesson-list__title">
                Preguntas de práctica
                <span className="lesson-list__status">Con el porqué de cada opción al responder; no cuentan para aprobar</span>
              </span>
              <span className="lesson-list__time">15 min</span>
            </Link>
          </li>
          <li>
            <Link to={`/cursos/${course.id}/examen`} className="lesson-list__link">
              <span className="lesson-list__order" aria-hidden="true">{passedExam ? '✓' : '◆'}</span>
              <span className="lesson-list__title">
                Examen de {course.evaluatedObjectives.length * 2} preguntas
                <span className={`lesson-list__status${passedExam ? ' lesson-list__status--done' : ''}`}>{examStatus}</span>
              </span>
              <span className="lesson-list__time">25 min</span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}

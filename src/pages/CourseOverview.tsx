import { Link, useParams } from 'react-router'
import { covers, downloadCourse, getCourse, imageSrcSet, isCourseOffline } from '../content'
import { useEffect, useState } from 'react'
import NotFound from './NotFound'
import { db } from '../storage/db'
import { courseProgress } from '../storage/progress'
import { assessmentAttempts } from '../storage/exam'
import { errorReviewQueue } from '../domain/review-queue'
import { now } from '../storage/progress'
import { useLive } from '../storage/useLive'

export default function CourseOverview() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const progress = useLive(() => courseProgress(db, course?.id ?? ''), [course?.id], [])
  const assessments = useLive(() => assessmentAttempts(db, course?.id ?? ''), [course?.id], [])
  const exams = assessments.filter((a) => a.kind === 'exam')
  const retained = assessments.some((a) => a.kind === 'retention' && a.result?.passed)
  const errors = useLive(
    async () => errorReviewQueue(await db.attempts.where('courseId').equals(course?.id ?? '').toArray(), await db.responses.toArray(), course?.id ?? '', now()),
    [course?.id],
    { due: [], upcoming: [], resolved: 0 },
  )
  if (!course) return <NotFound />
  const cover = covers[course.id]
  const status = (lessonId: string) => {
    const p = progress.find((x) => x.lessonId === lessonId)
    if (p?.lastCheck) return { label: `Completada · ${p.lastCheck.correct}/${p.lastCheck.total}`, kind: 'done' }
    if (p) return { label: 'Empezada', kind: 'started' }
    return null
  }
  const done = course.lessons.filter((l) => status(l.id)?.kind === 'done').length
  // El laboratorio guarda su ronda como una lección más, con el ID del laboratorio (D-024).
  const labCheck = progress.find((x) => x.lessonId === course.practice?.id)?.lastCheck
  const lastExam = exams.filter((a) => a.status === 'submitted').at(-1)
  const passedExam = exams.find((a) => a.result?.passed)
  const examStatus = exams.some((a) => a.status === 'in-progress')
    ? 'En curso'
    : passedExam
      ? `Aprobado · ${passedExam.result!.correct}/${passedExam.result!.total}${retained ? ' · retención comprobada' : ''}`
      : lastExam
        ? `No aprobado · ${lastExam.result!.correct}/${lastExam.result!.total}`
        : 'Pendiente'
  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span> {course.id.toUpperCase()}
      </nav>
      {cover && (
        <img className="course-cover" src={`${import.meta.env.BASE_URL}images/${cover}-960.webp`} srcSet={imageSrcSet(cover)} sizes="(min-width: 76rem) 76rem, 100vw" alt="" width={1600} height={900} />
      )}
      <h1>{course.title}</h1>
      <p className="lead">{course.centralQuestion}</p>
      {!course.complete && (
        <p className="notice notice--info">
          Manual en preparación: {course.lessons.length} de {course.lessonIds.length} lecciones escritas. El laboratorio y el examen llegan cuando esté completo y revisado.
        </p>
      )}
      <OfflineToggle courseId={course.id} bytes={course.package.bytes} />

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
            return (
              <li key={l.id}>
                <Link to={`/cursos/${course.id}/lecciones/${l.id}`} className="lesson-list__link">
                  <span className="lesson-list__order">{s?.kind === 'done' ? <span aria-hidden="true">✓</span> : l.order}</span>
                  <span className="lesson-list__title">
                    {l.title}
                    {s && <span className={`lesson-list__status lesson-list__status--${s.kind}`}>{s.label}</span>}
                  </span>
                  <span className="lesson-list__time">{l.estimatedMinutes} min</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Un manual en preparación no muestra práctica ni examen; la sección aparece solo si tiene algo (T024-04). */}
      <section className="section" aria-labelledby="practica" hidden={!course.complete && !course.practice && errors.due.length === 0 && errors.upcoming.length === 0}>
        <h2 id="practica">Práctica y examen</h2>
        <ul className="lesson-list">
          {course.practice && (
            <li>
              <Link to={`/cursos/${course.id}/laboratorio`} className="lesson-list__link">
                <span className="lesson-list__order" aria-hidden="true">{labCheck ? '✓' : '◆'}</span>
                <span className="lesson-list__title">
                  Laboratorio: {course.practice.title}
                  <span className={`lesson-list__status${labCheck ? ' lesson-list__status--done' : ''}`}>
                    {labCheck ? `Hecho · ${labCheck.correct}/${labCheck.total}` : `Caso práctico con ${course.practice.questionIds.length} preguntas de opción múltiple`}
                  </span>
                </span>
                <span className="lesson-list__time">{course.practice.estimatedMinutes} min</span>
              </Link>
            </li>
          )}
          {(errors.due.length > 0 || errors.upcoming.length > 0) && (
            <li>
              <Link to={`/cursos/${course.id}/repaso`} className="lesson-list__link">
                <span className="lesson-list__order" aria-hidden="true">↻</span>
                <span className="lesson-list__title">
                  Repaso de errores
                  <span className={`lesson-list__status${errors.due.length > 0 ? ' lesson-list__status--plan' : ''}`}>
                    {errors.due.length > 0 ? `${errors.due.length} para hoy` : `${errors.upcoming.length} en los próximos días`} · preguntas que fallaste estando muy seguro
                  </span>
                </span>
                <span className="lesson-list__time">5 min</span>
              </Link>
            </li>
          )}
          {course.complete && (
            <>
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
            </>
          )}
        </ul>
      </section>
    </div>
  )
}

/** Descargar el curso para usarlo sin conexión (F2-05): el paquete queda en la caché del SW. */
function OfflineToggle({ courseId, bytes }: { courseId: string; bytes: number }) {
  const [state, setState] = useState<'checking' | 'online' | 'offline' | 'loading' | 'error'>('checking')
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    void isCourseOffline(courseId).then((ok) => alive && setState(ok ? 'offline' : 'online'))
    return () => {
      alive = false
    }
  }, [courseId])
  const download = async () => {
    setState('loading')
    try {
      const ok = await downloadCourse(courseId)
      setState(ok ? 'offline' : 'online')
      setMessage(ok ? null : 'Se cargó, pero este navegador no lo guardó para usarlo sin conexión (la app instalada sí lo hace).')
    } catch (e) {
      setState('error')
      setMessage(e instanceof Error ? e.message : String(e))
    }
  }
  if (state === 'checking') return null
  return (
    <p className="offline-toggle" role="status">
      {state === 'offline' ? (
        <>✓ Disponible sin conexión en este dispositivo.</>
      ) : (
        <>
          <button type="button" className="button" onClick={download} disabled={state === 'loading'}>
            {state === 'loading' ? 'Descargando…' : `Descargar para usar sin conexión (${Math.round(bytes / 1024)} KB)`}
          </button>
          {message && <span className="muted"> {message}</span>}
        </>
      )}
    </p>
  )
}


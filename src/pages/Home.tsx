import { Link } from 'react-router'
import { content, covers, getCourse, imageSrcSet } from '../content'
import { db } from '../storage/db'
import { useLive } from '../storage/useLive'

export default function Home() {
  const progress = useLive(() => db.lessonProgress.toArray(), [], [])
  const attempts = useLive(() => db.attempts.toArray(), [], [])
  const last = [...progress].sort((a, b) => b.lastVisitedAt.localeCompare(a.lastVisitedAt))[0]
  const visitedCourse = getCourse(last?.courseId)
  const lastLesson = visitedCourse?.lessons.find((lesson) => lesson.id === last?.lessonId)
  const continuingCourse = visitedCourse ?? getCourse('m01')!
  const continuingTo = last
    ? lastLesson
      ? `/cursos/${visitedCourse!.id}/lecciones/${lastLesson.id}`
      : `/cursos/${visitedCourse!.id}/laboratorio`
    : `/cursos/${continuingCourse.id}/lecciones/${continuingCourse.lessons[0]!.id}`
  const continuingLabel = lastLesson ? `Lección ${lastLesson.order}` : last ? 'Laboratorio' : 'Empezar con M01'
  const continuingCover = covers[continuingCourse.id]

  return (
    <div className="page study-home">
      <header className="study-home__heading">
        <img className="study-home__mark" src={`${import.meta.env.BASE_URL}icons/mark.svg`} alt="" width="48" height="48" />
        <div>
          <p className="eyebrow">AI School</p>
          <h1>Tu estudio</h1>
        </div>
        <nav className="study-home__links" aria-label="Accesos de estudio">
          <Link to="/diagnostico">Diagnóstico</Link>
          <Link to="/como-funciona">Cómo funciona</Link>
        </nav>
      </header>

      <section aria-labelledby="continuar">
        <h2 id="continuar" className="study-home__section-title">Continuar</h2>
        <Link className="continue-card" to={continuingTo}>
          {continuingCover && <img src={`${import.meta.env.BASE_URL}images/${continuingCover}-480.webp`} alt="" width="1600" height="900" />}
          <span className="continue-card__body">
            <span className="continue-card__eyebrow">{continuingCourse.id.toUpperCase()} · {continuingLabel}</span>
            <strong>{continuingCourse.title}</strong>
            <span className="continue-card__action">Abrir →</span>
          </span>
        </Link>
      </section>

      <section aria-labelledby="manuales">
        <h2 id="manuales" className="study-home__section-title">Manuales</h2>
        <ol className="study-shelf">
          {content.courses.map((course) => {
            const courseProgress = progress.filter((item) => item.courseId === course.id)
            const doneLessons = course.lessons.filter((lesson) => courseProgress.some((item) => item.lessonId === lesson.id && item.checksCompletedAt)).length
            const labDone = !!course.practice && courseProgress.some((item) => item.lessonId === course.practice?.id && item.checksCompletedAt)
            const examDone = attempts.some((attempt) => attempt.courseId === course.id && attempt.kind === 'exam' && attempt.result?.passed)
            const stepsDone = doneLessons + Number(labDone) + Number(examDone)
            const cover = covers[course.id]
            return (
              <li key={course.id}>
                <Link className="study-course" to={`/cursos/${course.id}`}>
                  {cover && <img className="study-course__cover" src={`${import.meta.env.BASE_URL}images/${cover}-480.webp`} srcSet={imageSrcSet(cover)} sizes="(min-width: 70rem) 15rem, (min-width: 44rem) 30vw, 45vw" alt="" width="1600" height="900" loading="lazy" />}
                  <span className="study-course__body">
                    <span className="study-course__code">{course.id.toUpperCase()}</span>
                    <strong>{course.title}</strong>
                    <progress value={stepsDone} max={course.lessons.length + 2} aria-label={`${course.id.toUpperCase()}: ${doneLessons} de ${course.lessons.length} lecciones, ${labDone ? 'laboratorio hecho' : 'laboratorio pendiente'}, ${examDone ? 'examen aprobado' : 'examen pendiente'}`} />
                    <span className="study-course__status">{doneLessons}/{course.lessons.length} lecciones · {labDone ? 'lab ✓' : 'lab'} · {examDone ? 'examen ✓' : 'examen'}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

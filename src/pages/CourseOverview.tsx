import { Link, useParams } from 'react-router'
import { covers, getCourse, imageSrcSet } from '../content'
import NotFound from './NotFound'

export default function CourseOverview() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  if (!course) return <NotFound />
  const cover = covers[course.id]
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
        <ol className="lesson-list">
          {course.lessons.map((l) => (
            <li key={l.id}>
              <Link to={`/cursos/${course.id}/lecciones/${l.id}`} className="lesson-list__link">
                <span className="lesson-list__order">{l.order}</span>
                <span className="lesson-list__title">{l.title}</span>
                <span className="lesson-list__time">{l.estimatedMinutes} min</span>
              </Link>
            </li>
          ))}
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
          <li className="lesson-list__pending">
            <span className="lesson-list__order" aria-hidden="true">◇</span>
            <span className="lesson-list__title">Examen de 12 preguntas</span>
            <span className="lesson-list__time">Próximamente</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

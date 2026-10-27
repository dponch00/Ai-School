import { Link } from 'react-router'
import { content, covers, getCourse, imageSrcSet } from '../content'

export default function Library() {
  return (
    <div className="page">
      <h1>Cursos</h1>
      <p className="lead">Diez manuales. Los demás se publican cuando estén completos y revisados.</p>
      <p className="available-now">
        Disponible ahora:{' '}
        {content.catalog.filter((c) => c.available).map((c, i) => (
          <span key={c.id}>{i > 0 && ' · '}<Link to={`/cursos/${c.id}`}>{c.id.toUpperCase()} · {c.title}</Link></span>
        ))}
      </p>
      <ul className="course-grid">
        {content.catalog.map((c) => {
          const course = getCourse(c.id)
          const cover = covers[c.id]
          const body = (
            <>
              {cover && (
                <img className="course-card__cover" src={`${import.meta.env.BASE_URL}images/${cover}-480.webp`} srcSet={imageSrcSet(cover)} sizes="(min-width: 60rem) 24rem, 100vw" alt="" width={1600} height={900} loading="lazy" />
              )}
              <div className="course-card__body">
                <p className="course-card__code">{c.id.toUpperCase()}</p>
                <h2 className="course-card__title">{c.title}</h2>
                <p className="course-card__question">{c.centralQuestion}</p>
                <p className="course-card__status">
                  {!course ? 'Próximamente' : course.complete ? `Disponible · ${course.lessons.length} lecciones · laboratorio` : `En preparación · ${course.lessons.length} de ${course.lessonIds.length} lecciones`}
                </p>
              </div>
            </>
          )
          return (
            <li key={c.id} className={course ? 'course-card course-card--available' : 'course-card course-card--upcoming'}>
              {course ? <Link to={`/cursos/${c.id}`} className="course-card__link">{body}</Link> : body}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

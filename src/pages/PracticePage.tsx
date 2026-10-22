import { Link, useParams } from 'react-router'
import { content, getCourse } from '../content'
import QuestionCheck from '../components/QuestionCheck'
import { useCheckRound } from '../storage/useCheckRound'
import NotFound from './NotFound'

/** Modo práctica (plan §5, Exámenes): preguntas fuera del examen, con feedback inmediato. */
export default function PracticePage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const questions = course ? Object.values(content.questions).filter((q) => q.use === 'practice' && q.courseId === course.id) : []
  const record = useCheckRound({ courseId: course?.id ?? '', lessonId: course?.id ?? 'x', purpose: 'practice', contentVersion: course?.version ?? '0.0.0', size: questions.length })
  if (!course) return <NotFound />

  return (
    <div className="page page--reader">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/cursos/${course.id}`}>{course.id.toUpperCase()}</Link> <span aria-hidden="true">/</span> Práctica
      </nav>
      <article className="exam">
        <h1>Preguntas de práctica</h1>
        <p className="lead">
          {questions.length} preguntas que no aparecen en el examen. Aquí ves el porqué de cada opción en cuanto respondes, así que sirven para entrenar antes del examen. No cuentan para aprobar.
        </p>
        {questions.map((q, i) => (
          <QuestionCheck key={q.id} question={q} courseId={course.id} label={`Práctica ${i + 1} de ${questions.length}`} onAnswer={record} />
        ))}
        <p>
          <Link to={`/cursos/${course.id}/examen`} className="button button--primary">Ir al examen</Link>
        </p>
      </article>
    </div>
  )
}

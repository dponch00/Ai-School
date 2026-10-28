import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { scrollToAnchor } from '../components/anchors'
import { content, getCourse, useCoursePackage } from '../content'
import LessonBlocks from '../components/LessonBlocks'
import QuestionCheck from '../components/QuestionCheck'
import Toc from '../components/Toc'
import ReaderProgress from '../components/ReaderProgress'
import NotFound from './NotFound'
import { db } from '../storage/db'
import { lessonProgress } from '../storage/progress'
import { useCheckRound } from '../storage/useCheckRound'
import { useLive } from '../storage/useLive'

/**
 * Laboratorio como caso práctico (D-024): el instructivo por pasos y, al final de cada paso, sus preguntas de
 * opción múltiple con explicación. Se registra como una ronda de comprobación con el ID del laboratorio, así que
 * cuenta como hecho al responder todas, y los errores con confianza alta entran al repaso de errores.
 */
export default function LabPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { pkg, error: pkgError } = useCoursePackage(course?.id)
  const lab = course?.practice
  const [params] = useSearchParams()
  const target = params.get('seccion')
  const ids = { courseId: course?.id ?? '', lessonId: lab?.id ?? '', contentVersion: course?.version ?? '0.0.0' }
  const record = useCheckRound({ ...ids, purpose: 'checks', size: lab?.questionIds.length ?? 0 })
  const [visitStart] = useState(() => new Date().toISOString())
  const progress = useLive(() => lessonProgress(db, ids.courseId, ids.lessonId), [ids.courseId, ids.lessonId], undefined)
  useEffect(() => {
    if (target && pkg) requestAnimationFrame(() => scrollToAnchor(target))
  }, [target, pkg])
  if (!course || !lab) return <NotFound />

  const questions = lab.questionIds.map((id) => pkg?.questions[id]).filter((q) => q !== undefined)
  const total = questions.length
  const stepQuestions = (step: string) => {
    const inStep = questions.filter((q) => q.labStep === step)
    return (
      <section className="checks lab-step" aria-label="Preguntas de este paso">
        {inStep.map((q) => (
          <QuestionCheck key={q.id} question={q} courseId={course.id} label={`Pregunta ${questions.indexOf(q) + 1} de ${total}`} onAnswer={record} />
        ))}
      </section>
    )
  }
  const last = progress?.lastCheck

  return (
    <div className="page page--reader">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/cursos/${course.id}`}>{course.id.toUpperCase()}</Link> <span aria-hidden="true">/</span> Laboratorio
      </nav>
      <div className="reader">
        <Toc entries={lab.toc} />
        <article className="reader__main" aria-labelledby="lab-title">
          <p className="eyebrow">Laboratorio de {course.id.toUpperCase()} · {total} preguntas · {lab.estimatedMinutes} min</p>
          <h1 id="lab-title">{lab.title}</h1>
          <ReaderProgress
            courseId={course.id}
            currentLesson={0}
            lessonCount={course.lessons.length}
            targetId="lector-contenido"
            kind="lab"
            ready={!!pkg?.practiceBlocks}
          />
          <div id="lector-contenido">
            {last && (
              <p className="checks__last" role="status">
                {last.at < visitStart
                  ? `La última vez acertaste ${last.correct} de ${last.total}. Las opciones cambian de orden en cada visita.`
                  : `Guardado: acertaste ${last.correct} de ${last.total}. El laboratorio cuenta como hecho.`}
              </p>
            )}
            {pkg?.practiceBlocks ? (
              <LessonBlocks blocks={pkg.practiceBlocks} productCards={pkg.productCards} assets={pkg.assets} sources={Object.values(content.sources)} labQuestions={stepQuestions} />
            ) : (
              <p className="notice notice--info" role="status">{pkgError ?? 'Cargando el caso…'}</p>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}

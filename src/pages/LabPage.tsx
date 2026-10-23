import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { scrollToAnchor } from '../components/anchors'
import { content, getCourse, useCoursePackage } from '../content'
import LessonBlocks from '../components/LessonBlocks'
import Toc from '../components/Toc'
import LabSubmission from '../components/LabSubmission'
import NotFound from './NotFound'

const LEVEL = ['', 'Inicial', 'Adecuado', 'Sólido', 'Destacado']

export default function LabPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { pkg, error: pkgError } = useCoursePackage(course?.id)
  const lab = course?.practice
  const [params] = useSearchParams()
  const target = params.get('seccion')
  useEffect(() => {
    if (target && pkg) requestAnimationFrame(() => scrollToAnchor(target))
  }, [target, pkg])
  if (!course || !lab) return <NotFound />
  return (
    <div className="page page--reader">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/cursos">Cursos</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/cursos/${course.id}`}>{course.id.toUpperCase()}</Link> <span aria-hidden="true">/</span> Laboratorio
      </nav>
      <div className="reader">
        <Toc entries={[...lab.toc, { id: 'rubrica', text: 'Rúbrica' }, { id: 'entrega', text: 'Tu entrega' }]} />
        <article className="reader__main" aria-labelledby="lab-title">
          <p className="eyebrow">Laboratorio de {course.id.toUpperCase()}</p>
          <h1 id="lab-title">{lab.title}</h1>
          {pkg?.practiceBlocks ? (
            <LessonBlocks blocks={pkg.practiceBlocks} productCards={pkg.productCards} assets={pkg.assets} sources={Object.values(content.sources)} />
          ) : (
            <p className="notice notice--info" role="status">{pkgError ?? 'Cargando las instrucciones…'}</p>
          )}
          <section className="section" aria-labelledby="rubrica">
            <h2 id="rubrica">Rúbrica</h2>
            <p className="muted">Los criterios marcados como críticos no se compensan con otros: deben llegar al menos al nivel 2.</p>
            {lab.rubric.map((c) => (
              <div key={c.id} className="rubric">
                <h3 className="rubric__name">{c.name}{c.critical && <span className="badge">Crítico</span>}</h3>
                <ol className="rubric__levels">
                  {c.levels.map((l) => (
                    <li key={l.level}><strong>{l.level} · {LEVEL[l.level]}.</strong> {l.descriptor}</li>
                  ))}
                </ol>
              </div>
            ))}
            <details className="model-answer">
              <summary>Ver ejemplo de entrega lograda</summary>
              <p>{lab.anchors.achieved}</p>
            </details>
            <details className="model-answer">
              <summary>Ver ejemplo de entrega insuficiente</summary>
              <p>{lab.anchors.insufficient}</p>
            </details>
          </section>
          <LabSubmission practice={lab} />
        </article>
      </div>
    </div>
  )
}

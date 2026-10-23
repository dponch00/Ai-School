import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { content } from '../content'
import { scrollToAnchor } from '../components/anchors'

/** Glosario (F2-07): cada término resume su lección y lleva a los apartados donde se explica. */
export default function GlossaryPage() {
  const [params] = useSearchParams()
  const target = params.get('termino')
  const terms = [...content.glossary].sort((a, b) => a.term.localeCompare(b.term, 'es'))
  const lessonLabel = (lessonId: string) => {
    const course = content.courses.find((c) => c.lessons.some((l) => l.id === lessonId))
    const lesson = course?.lessons.find((l) => l.id === lessonId)
    return { course, lesson }
  }

  useEffect(() => {
    if (target) requestAnimationFrame(() => scrollToAnchor(target))
  }, [target])

  return (
    <div className="page page--reader">
      <article className="glossary">
        <h1>Glosario</h1>
        <p className="lead">Los términos del curso en una frase o dos, con enlace a la lección donde se explican con calma.</p>
        <dl>
          {terms.map((g) => (
            <div key={g.id} id={g.id} className={`glossary__term${g.id === target ? ' glossary__term--target' : ''}`} tabIndex={-1}>
              <dt>
                {g.term}
                {g.en && <span className="muted" lang="en"> · {g.en}</span>}
              </dt>
              <dd>
                <p>{g.definition}</p>
                <p className="glossary__refs">
                  {g.refs.map((ref, i) => {
                    const [lessonId, anchor] = ref.split('#')
                    const { course, lesson } = lessonLabel(lessonId)
                    const section = lesson?.toc.find((t) => t.id === anchor)
                    return (
                      <span key={ref}>
                        {i > 0 && ' · '}
                        <Link to={`/cursos/${course?.id}/lecciones/${lessonId}?seccion=${anchor}`}>
                          {course?.id.toUpperCase()} L{lesson?.order}: {section?.text ?? anchor}
                        </Link>
                      </span>
                    )
                  })}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  )
}

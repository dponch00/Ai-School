import { useEffect, useRef, type MouseEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { content, getCourse, useCoursePackage, type Block } from '../content'

/**
 * Panel lateral de relaciones: definiciones del glosario (`:term`), manuales, lecciones o apartados
 * relacionados (`:ref`) y fuentes citadas (`:cite`), sin salir de la lección. Entra desde la derecha;
 * el botón «atrás» del sistema lo cierra en lugar de dejar la lección.
 */
export type Relation = { kind: 'term'; id: string } | { kind: 'ref'; to: string } | { kind: 'cite'; sourceId: string }

/** La relación que abre un clic, o null si el clic no es sobre un término, una referencia o una cita. */
export function relationFromClick(e: MouseEvent): Relation | null {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return null
  if (a.dataset.term) return { kind: 'term', id: a.dataset.term }
  if (a.dataset.ref) return { kind: 'ref', to: a.dataset.ref }
  if (a.dataset.source && a.closest('sup.cite')) return { kind: 'cite', sourceId: a.dataset.source }
  return null
}

const REF = /^(m\d{2})(?:-(l\d)(?:#([a-z0-9-]+))?)?$/

function parseRef(to: string) {
  const [, courseId, lessonPart, anchor] = to.match(REF) ?? []
  return { courseId, lessonId: lessonPart ? `${courseId}-${lessonPart}` : undefined, anchor }
}

export function refPath(to: string): string {
  const { courseId, lessonId, anchor } = parseRef(to)
  if (!lessonId) return `/cursos/${courseId}`
  return `/cursos/${courseId}/lecciones/${lessonId}${anchor ? `?seccion=${anchor}` : ''}`
}

/** Fragmentos de HTML de la lección (sin ids, para no duplicarlos en la página). */
function extract(blocks: Block[], select: (root: HTMLElement) => Element[]): string {
  const root = document.createElement('div')
  root.innerHTML = blocks.flatMap((b) => (b.type === 'html' ? [b.html] : [])).join('')
  const parts = select(root)
  for (const el of parts) for (const withId of [el, ...el.querySelectorAll('[id]')]) withId.removeAttribute('id')
  return parts.map((el) => el.outerHTML).join('')
}

function sectionParts(root: HTMLElement, anchor: string): Element[] {
  const h2 = root.querySelector(`h2#${CSS.escape(anchor)}`)
  const out: Element[] = []
  for (let el = h2?.nextElementSibling; el && el.tagName !== 'H2'; el = el.nextElementSibling) out.push(el)
  return out
}

/** Dónde queda el destino respecto de lo que se está leyendo: sirve para recordar o para anticipar. */
function whereLabel(here: { courseId?: string; lessonId?: string }, courseId: string, lessonId?: string): string {
  if (courseId === here.courseId && (!lessonId || lessonId === here.lessonId)) return lessonId ? 'En esta misma lección' : 'El manual que estás leyendo'
  const rank = (c?: string, l?: string) => {
    const lesson = getCourse(c)?.lessons.find((x) => x.id === l)
    // El laboratorio (sin lección en la ruta) va después de las seis lecciones.
    return content.catalog.findIndex((x) => x.id === c) * 100 + (lesson ? lesson.order : l ? 0 : 99)
  }
  const target = content.catalog.findIndex((x) => x.id === courseId) * 100 + (getCourse(courseId)?.lessons.find((x) => x.id === lessonId)?.order ?? 0)
  return target < rank(here.courseId, here.lessonId) ? 'Para recordar · ya lo viste' : 'Para anticipar · lo verás más adelante'
}

function TermView({ id, push, here }: { id: string; push: (r: Relation) => void; here: { lessonId?: string } }) {
  const g = content.glossary.find((x) => x.id === id)
  if (!g) return <p>Este término no está en el glosario.</p>
  const label = (lessonId: string, anchor?: string) => {
    const course = content.courses.find((c) => c.lessons.some((l) => l.id === lessonId))
    const lesson = course?.lessons.find((l) => l.id === lessonId)
    const section = anchor ? lesson?.toc.find((t) => t.id === anchor)?.text : lesson?.title
    return `${course?.id.toUpperCase()} · L${lesson?.order}: ${section ?? anchor}`
  }
  const also = g.usedIn.filter((l) => l !== here.lessonId && !g.refs.some((r) => r.startsWith(`${l}#`)))
  return (
    <>
      <p className="relation__kind">Definición</p>
      <h2 id="relation-title" className="relation__title">
        {g.term}
        {g.en && <span className="muted" lang="en"> · {g.en}</span>}
      </h2>
      <p className="relation__lead">{g.definition}</p>
      <h3 className="relation__subtitle">Se explica en</h3>
      <ul className="relation__links">
        {g.refs.map((ref) => (
          <li key={ref}>
            <button type="button" onClick={() => push({ kind: 'ref', to: ref })}>{label(...(ref.split('#') as [string, string]))}</button>
          </li>
        ))}
      </ul>
      {also.length > 0 && (
        <>
          <h3 className="relation__subtitle">También aparece en</h3>
          <ul className="relation__links">
            {also.map((l) => (
              <li key={l}>
                <button type="button" onClick={() => push({ kind: 'ref', to: l })}>{label(l)}</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

function RefView({ to, push, here }: { to: string; push: (r: Relation) => void; here: { courseId?: string; lessonId?: string } }) {
  const { courseId, lessonId, anchor } = parseRef(to)
  const course = getCourse(courseId)
  const lesson = course?.lessons.find((l) => l.id === lessonId)
  const { pkg, error } = useCoursePackage(lesson ? courseId : undefined)
  if (!course) return <p>Este manual no existe.</p>
  const where = whereLabel(here, course.id, lesson?.id)

  if (!lesson) {
    return (
      <>
        <p className="relation__kind">{where}</p>
        <h2 id="relation-title" className="relation__title">{course.id.toUpperCase()} · {course.title}</h2>
        <p className="relation__lead">{content.catalog.find((c) => c.id === course.id)?.centralQuestion}</p>
        <h3 className="relation__subtitle">Lecciones</h3>
        <ul className="relation__links">
          {course.lessons.map((l) => (
            <li key={l.id}>
              <button type="button" onClick={() => push({ kind: 'ref', to: l.id })}>L{l.order}: {l.title}</button>
            </li>
          ))}
        </ul>
      </>
    )
  }

  const section = anchor ? lesson.toc.find((t) => t.id === anchor) : undefined
  const blocks = pkg?.lessons[lesson.id]?.blocks
  const html = blocks
    ? anchor
      ? extract(blocks, (root) => sectionParts(root, anchor))
      : extract(blocks, (root) => [...root.querySelectorAll('.lesson-decision, .lesson-summary')])
    : ''
  return (
    <>
      <p className="relation__kind">{where}</p>
      <h2 id="relation-title" className="relation__title">{section?.text ?? lesson.title}</h2>
      <p className="relation__context">{course.id.toUpperCase()} · Lección {lesson.order}{section ? `: ${lesson.title}` : ''}</p>
      {!blocks && <p className="muted" role="status">{error ?? 'Cargando…'}</p>}
      {html && <div className="prose relation__body" dangerouslySetInnerHTML={{ __html: html }} />}
    </>
  )
}

function CiteView({ sourceId }: { sourceId: string }) {
  const s = content.sources[sourceId]
  if (!s) return <p>Esta fuente no está en el registro.</p>
  return (
    <>
      <p className="relation__kind">Fuente citada</p>
      <h2 id="relation-title" className="relation__title">{s.title}</h2>
      <p className="relation__lead">{s.organization}. Consultada el {s.accessedAt}.</p>
      <p>
        <a className="button" href={s.url} target="_blank" rel="noreferrer">Abrir la fuente ↗</a>
      </p>
      <p className="muted">Se abre en el navegador y necesita conexión.</p>
    </>
  )
}

interface Props {
  stack: Relation[]
  onChange: (stack: Relation[]) => void
}

export default function RelationPanel({ stack, onChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const pushed = useRef(false)
  const navigate = useNavigate()
  const { courseId, lessonId } = useParams()
  const open = stack.length > 0
  const current = stack[stack.length - 1]

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Una entrada de historial propia: «atrás» cierra el panel y no deja la lección.
      history.pushState({ ...history.state, aisPanel: true }, '')
      pushed.current = true
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const onPop = () => {
      if (!pushed.current) return
      pushed.current = false
      onChange([])
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onChange])

  // Al salir de la página con el panel abierto, la entrada propia del historial ya no sirve.
  useEffect(() => () => void (pushed.current = false), [])

  const close = () => {
    if (pushed.current) history.back()
    else onChange([])
  }
  const push = (r: Relation) => onChange([...stack, r])
  const go = (to: string) => {
    pushed.current = false
    onChange([])
    navigate(to, { replace: true })
  }
  const onBodyClick = (e: MouseEvent) => {
    const r = relationFromClick(e)
    if (r) {
      e.preventDefault()
      push(r)
    }
  }

  return (
    <dialog
      ref={ref}
      className="relation-panel"
      aria-labelledby="relation-title"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => {
        // El panel vive dentro del cuerpo de la lección: sus clics no deben llegar al manejador de la lección.
        e.stopPropagation()
        if (e.target === e.currentTarget) close()
      }}
    >
      {current && (
        <div className="relation-panel__inner">
          <div className="relation-panel__bar">
            {stack.length > 1 ? (
              <button type="button" className="relation-panel__icon" onClick={() => onChange(stack.slice(0, -1))} aria-label="Volver a la relación anterior">←</button>
            ) : (
              <span />
            )}
            <button type="button" className="relation-panel__icon" onClick={close} aria-label="Cerrar el panel">✕</button>
          </div>
          <div className="relation-panel__content" onClick={onBodyClick} key={stack.length}>
            {current.kind === 'term' && <TermView id={current.id} push={push} here={{ lessonId }} />}
            {current.kind === 'ref' && <RefView to={current.to} push={push} here={{ courseId, lessonId }} />}
            {current.kind === 'cite' && <CiteView sourceId={current.sourceId} />}
          </div>
          {current.kind === 'ref' && (
            <div className="relation-panel__footer">
              <button type="button" className="button button--primary" onClick={() => go(refPath(current.to))}>
                {parseRef(current.to).lessonId ? 'Ir a la lección' : 'Ir al manual'} →
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

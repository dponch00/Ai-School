import { useState } from 'react'
import { Link } from 'react-router'
import { content } from '../content'
import { HIGHLIGHT_COLORS } from '../components/highlighting'
import type { Highlight, HighlightColor } from '../domain/learner'
import { db } from '../storage/db'
import { useLive } from '../storage/useLive'

interface LessonRef {
  courseId: string
  courseTitle: string
  courseOrder: number
  lessonOrder: number
  title: string
  href: string
}

function lessonRef(lessonId: string): LessonRef | null {
  const ci = content.courses.findIndex((c) => c.lessons.some((l) => l.id === lessonId))
  if (ci < 0) return null
  const course = content.courses[ci]
  const lesson = course.lessons.find((l) => l.id === lessonId)!
  return { courseId: course.id, courseTitle: course.title, courseOrder: ci, lessonOrder: lesson.order, title: lesson.title, href: `/cursos/${course.id}/lecciones/${lesson.id}` }
}

/** Mis subrayados, notas y marcadores, agrupados para repasar (pedido de Daniel, 2026-10-25). */
export default function NotesPage() {
  const data = useLive(
    async () => ({ notes: await db.notes.toArray(), bookmarks: await db.bookmarks.toArray(), highlights: await db.highlights.toArray() }),
    [],
    null,
  )
  const [course, setCourse] = useState('todos')
  const [colors, setColors] = useState<HighlightColor[]>([])
  const [onlyNotes, setOnlyNotes] = useState(false)
  const [review, setReview] = useState(false)
  const [shown, setShown] = useState<Set<string>>(new Set())
  if (!data) return null

  const visible = data.highlights.filter(
    (h) => (course === 'todos' || h.courseId === course) && (colors.length === 0 || colors.includes(h.color)) && (!onlyNotes || !!h.note),
  )
  const notesByLesson = new Map(data.notes.map((n) => [n.targetId, n]))
  // Lecciones con algo que mostrar: subrayados visibles o, sin filtros de color ni de nota, su nota general.
  const lessonIds = new Set(visible.map((h) => h.lessonId))
  if (colors.length === 0 && !onlyNotes) for (const n of data.notes) if (course === 'todos' || lessonRef(n.targetId)?.courseId === course) lessonIds.add(n.targetId)
  const lessons = [...lessonIds]
    .map((id) => ({ id, ref: lessonRef(id) }))
    .sort((a, b) => (a.ref?.courseOrder ?? 99) - (b.ref?.courseOrder ?? 99) || (a.ref?.lessonOrder ?? 0) - (b.ref?.lessonOrder ?? 0))
  const coursesWithData = content.courses.filter((c) => data.highlights.some((h) => h.courseId === c.id) || data.notes.some((n) => lessonRef(n.targetId)?.courseId === c.id))
  const toggleColor = (c: HighlightColor) => setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  const reveal = (id: string) => setShown((prev) => new Set(prev).add(id))

  return (
    <div className="page page--reader">
      <article>
        <h1>Mis subrayados y notas</h1>
        <p className="lead">Lo que marcaste mientras leías, ordenado por manual, lección y sección. Solo vive en este navegador y en tus respaldos.</p>

        {data.highlights.length === 0 && data.notes.length === 0 ? (
          <p className="notice notice--info">Todavía no tienes subrayados ni notas. En cualquier lección, selecciona un texto para subrayarlo y agregarle una nota.</p>
        ) : (
          <>
            <section className="notes-filters" aria-label="Filtros">
              <label>
                Manual{' '}
                <select value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="todos">Todos</option>
                  {coursesWithData.map((c) => <option key={c.id} value={c.id}>{c.id.toUpperCase()} · {c.title}</option>)}
                </select>
              </label>
              <div role="group" aria-label="Colores" className="notes-filters__colors">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button key={c.id} type="button" className={`hl-swatch hl-swatch--${c.id}`} aria-label={`Solo ${c.label.toLowerCase()}`} aria-pressed={colors.includes(c.id)} onClick={() => toggleColor(c.id)} />
                ))}
              </div>
              <label><input type="checkbox" checked={onlyNotes} onChange={(e) => setOnlyNotes(e.target.checked)} /> Solo con nota</label>
              <label><input type="checkbox" checked={review} onChange={(e) => { setReview(e.target.checked); setShown(new Set()) }} /> Modo repaso</label>
            </section>
            {review && (
              <p className="muted">En modo repaso, el texto subrayado queda oculto. Lee la sección y tu nota, intenta recordarlo y después destápalo.</p>
            )}

            {lessons.length === 0 && <p className="muted">Ningún subrayado coincide con los filtros.</p>}
            {lessons.map(({ id, ref }) => {
              const items = visible.filter((h) => h.lessonId === id).sort((a, b) => a.position - b.position)
              const note = colors.length === 0 && !onlyNotes ? notesByLesson.get(id) : undefined
              const sections = groupBySection(items)
              return (
                <section key={id} className="section notes-lesson" aria-labelledby={`n-${id}`}>
                  <p className="eyebrow">{ref ? `${ref.courseId.toUpperCase()} · ${ref.courseTitle}` : id}</p>
                  <h2 id={`n-${id}`}>{ref ? <Link to={ref.href}>Lección {ref.lessonOrder}: {ref.title}</Link> : id}</h2>
                  {note && (
                    <div className="note-item">
                      <p className="muted">Nota general de la lección · {new Date(note.updatedAt).toLocaleDateString('es')}</p>
                      <p className="note-item__text">{note.text}</p>
                    </div>
                  )}
                  {sections.map((s) => (
                    <div key={s.key} className="notes-section">
                      <h3>{s.title ?? 'Inicio de la lección'}</h3>
                      <ul className="hl-list">
                        {s.items.map((h) => (
                          <li key={h.id} className="hl-list__item">
                            {review && !shown.has(h.id) ? (
                              <p className="hl-list__quote">
                                <button type="button" className="button button--small" onClick={() => reveal(h.id)}>Mostrar el subrayado</button>
                              </p>
                            ) : (
                              <p className="hl-list__quote"><mark className={`hl hl--${h.color}`}>{h.quote}</mark></p>
                            )}
                            {h.note && <p className="hl-list__note">{h.note}</p>}
                            <p className="hl-list__actions">
                              {ref && (
                                <Link className="button button--small" to={`${ref.href}?${s.id ? `seccion=${encodeURIComponent(s.id)}&` : ''}hl=${h.id}`}>
                                  Ir a la sección
                                </Link>
                              )}
                              <span className="muted">{new Date(h.updatedAt).toLocaleDateString('es')}</span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )
            })}
          </>
        )}

        <section className="section" aria-labelledby="marcadores">
          <h2 id="marcadores">Lecciones marcadas</h2>
          {data.bookmarks.length === 0 ? (
            <p className="muted">Todavía no marcaste ninguna lección. Usa «Marcar esta lección» al final de cada una.</p>
          ) : (
            <ul>
              {data.bookmarks.map((b) => {
                const ref = lessonRef(b.targetId)
                return <li key={b.id}>{ref ? <Link to={ref.href}>{ref.courseId.toUpperCase()} · Lección {ref.lessonOrder}: {ref.title}</Link> : b.targetId}</li>
              })}
            </ul>
          )}
        </section>
      </article>
    </div>
  )
}

function groupBySection(items: Highlight[]) {
  const groups: { key: string; id: string | null; title: string | null; items: Highlight[] }[] = []
  for (const h of items) {
    const key = h.sectionId ?? '__inicio'
    let g = groups.find((x) => x.key === key)
    if (!g) {
      g = { key, id: h.sectionId, title: h.sectionTitle, items: [] }
      groups.push(g)
    }
    g.items.push(h)
  }
  return groups
}

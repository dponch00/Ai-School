import { Link } from 'react-router'
import { content } from '../content'
import { db } from '../storage/db'
import { useLive } from '../storage/useLive'

/** Mis notas y marcadores (F2-07). */
export default function NotesPage() {
  const data = useLive(async () => ({ notes: await db.notes.toArray(), bookmarks: await db.bookmarks.toArray() }), [], null)
  const lesson = (id: string) => {
    const course = content.courses.find((c) => c.lessons.some((l) => l.id === id))
    const l = course?.lessons.find((x) => x.id === id)
    return course && l ? { href: `/cursos/${course.id}/lecciones/${l.id}`, label: `${course.id.toUpperCase()} · Lección ${l.order}: ${l.title}` } : { href: '/cursos', label: id }
  }
  if (!data) return null
  const notes = [...data.notes].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  return (
    <div className="page page--reader">
      <article>
        <h1>Mis notas y marcadores</h1>
        <p className="lead">Lo que guardaste mientras leías. Solo vive en este navegador y en tus respaldos.</p>
        <section className="section" aria-labelledby="marcadores">
          <h2 id="marcadores">Marcadores</h2>
          {data.bookmarks.length === 0 ? (
            <p className="muted">Todavía no marcaste ninguna lección. Usa «Marcar esta lección» al final de cada una.</p>
          ) : (
            <ul>{data.bookmarks.map((b) => <li key={b.id}><Link to={lesson(b.targetId).href}>{lesson(b.targetId).label}</Link></li>)}</ul>
          )}
        </section>
        <section className="section" aria-labelledby="notas">
          <h2 id="notas">Notas</h2>
          {notes.length === 0 ? (
            <p className="muted">Todavía no escribiste notas.</p>
          ) : (
            notes.map((n) => (
              <div key={n.id} className="note-item">
                <p><Link to={lesson(n.targetId).href}>{lesson(n.targetId).label}</Link> <span className="muted">· {new Date(n.updatedAt).toLocaleDateString('es')}</span></p>
                <p className="note-item__text">{n.text}</p>
              </div>
            ))
          )}
        </section>
      </article>
    </div>
  )
}

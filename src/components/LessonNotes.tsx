import { useState } from 'react'
import { Link } from 'react-router'
import type { Note } from '../storage/db'
import { db } from '../storage/db'
import { getNote, isBookmarked, MAX_NOTE, saveNote, toggleBookmark } from '../storage/notes'
import { useLive } from '../storage/useLive'

/** Marcador y nota personal al final de cada lección (F2-07). */
export default function LessonNotes({ lessonId }: { lessonId: string }) {
  const loaded = useLive(async () => ({ note: await getNote(db, lessonId), marked: await isBookmarked(db, lessonId) }), [lessonId], null)
  return loaded ? <Form key={lessonId} lessonId={lessonId} note={loaded.note} marked={loaded.marked} /> : null
}

function Form({ lessonId, note, marked }: { lessonId: string; note?: Note; marked: boolean }) {
  const [text, setText] = useState(note?.text ?? '')
  const [status, setStatus] = useState<string | null>(null)
  const save = async () => {
    try {
      const saved = await saveNote(db, lessonId, text)
      setStatus(saved ? 'Nota guardada.' : 'Nota borrada.')
    } catch (e) {
      setStatus(`No se pudo guardar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  return (
    <section className="section lesson-notes form-page" aria-labelledby="mis-notas">
      <h2 id="mis-notas">Mis notas</h2>
      <button type="button" className="button" aria-pressed={marked} onClick={() => void toggleBookmark(db, lessonId)}>
        {marked ? '★ Lección marcada' : '☆ Marcar esta lección'}
      </button>
      <label>Nota sobre esta lección <small>(solo para ti. {text.length} de {MAX_NOTE.toLocaleString('es')})</small>
        <textarea rows={4} maxLength={MAX_NOTE} value={text} onChange={(e) => setText(e.target.value)} onBlur={save} />
      </label>
      <button type="button" className="button" onClick={save}>Guardar nota</button>
      {status && <span role="status"> {status}</span>}
      <p className="muted"><Link to="/notas">Ver todas mis notas y marcadores</Link></p>
    </section>
  )
}

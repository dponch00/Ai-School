/**
 * Notas y marcadores por lección (F2-07). Viven en IndexedDB y viajan en el respaldo.
 */
import type { Bookmark, LearnerDb, Note } from './db'
import { newLocalId, now } from './progress'

export const MAX_NOTE = 10000

export async function getNote(db: LearnerDb, targetId: string): Promise<Note | undefined> {
  return db.notes.where('targetId').equals(targetId).first()
}

/** Guarda la nota de una lección; vacía, se borra. */
export async function saveNote(db: LearnerDb, targetId: string, text: string, at = now()): Promise<Note | null> {
  if (targetId.length > 64) throw new Error('El identificador de la nota es demasiado largo')
  const clean = text.slice(0, MAX_NOTE)
  return db.transaction('rw', db.notes, async () => {
    const prev = await getNote(db, targetId)
    if (!clean.trim()) {
      if (prev) await db.notes.delete(prev.id)
      return null
    }
    const note: Note = { id: prev?.id ?? newLocalId(), targetId, text: clean, updatedAt: at }
    await db.notes.put(note)
    return note
  })
}

export async function isBookmarked(db: LearnerDb, targetId: string): Promise<boolean> {
  return (await db.bookmarks.where('targetId').equals(targetId).count()) > 0
}

/** Marca o desmarca una lección; devuelve si quedó marcada. */
export async function toggleBookmark(db: LearnerDb, targetId: string, at = now()): Promise<boolean> {
  return db.transaction('rw', db.bookmarks, async () => {
    const existing = await db.bookmarks.where('targetId').equals(targetId).toArray()
    if (existing.length > 0) {
      await db.bookmarks.bulkDelete(existing.map((b) => b.id))
      return false
    }
    const b: Bookmark = { id: newLocalId(), targetId, createdAt: at }
    await db.bookmarks.put(b)
    return true
  })
}

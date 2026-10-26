/**
 * Subrayados con nota (pedido de Daniel, 2026-10-25). Viven en IndexedDB y viajan en el respaldo.
 */
import { Highlight, type HighlightColor } from '../domain/learner'
import type { LearnerDb } from './db'
import { newLocalId, now } from './progress'

export const MAX_HIGHLIGHT_NOTE = 4000

export type NewHighlight = Omit<Highlight, 'id' | 'createdAt' | 'updatedAt' | 'note'> & { note?: string }

export async function addHighlight(db: LearnerDb, h: NewHighlight, at = now()): Promise<Highlight> {
  const note = h.note?.slice(0, MAX_HIGHLIGHT_NOTE).trim()
  const record = Highlight.parse({ ...h, note: note || undefined, id: newLocalId(), createdAt: at, updatedAt: at })
  await db.highlights.put(record)
  return record
}

/** Cambia el color o la nota. Una nota vacía se quita. */
export async function updateHighlight(
  db: LearnerDb,
  id: string,
  change: { color?: HighlightColor; note?: string },
  at = now(),
): Promise<Highlight | undefined> {
  return db.transaction('rw', db.highlights, async () => {
    const prev = await db.highlights.get(id)
    if (!prev) return undefined
    const note = change.note === undefined ? prev.note : change.note.slice(0, MAX_HIGHLIGHT_NOTE).trim() || undefined
    const next = Highlight.parse({ ...prev, color: change.color ?? prev.color, note, updatedAt: at })
    await db.highlights.put(next)
    return next
  })
}

export type HighlightAnchor = Pick<Highlight, 'quote' | 'prefix' | 'suffix' | 'position' | 'sectionId' | 'sectionTitle' | 'contentVersion'>

/**
 * Une subrayados que se cruzan (T036-UX-04): `keepId` toma el tramo unido y conserva su color; las
 * notas de todos se juntan en orden y los demás se borran. Así nunca quedan marcas anidadas.
 */
export async function mergeHighlights(db: LearnerDb, keepId: string, removeIds: string[], anchor: HighlightAnchor, at = now()): Promise<Highlight | undefined> {
  return db.transaction('rw', db.highlights, async () => {
    const keep = await db.highlights.get(keepId)
    if (!keep) return undefined
    const others = (await db.highlights.bulkGet(removeIds)).filter((h): h is Highlight => !!h)
    const notes = [keep, ...others].map((h) => h.note).filter(Boolean)
    const note = notes.join('\n\n').slice(0, MAX_HIGHLIGHT_NOTE).trim() || undefined
    const next = Highlight.parse({ ...keep, ...anchor, note, updatedAt: at })
    await db.highlights.put(next)
    await db.highlights.bulkDelete(others.map((h) => h.id))
    return next
  })
}

export async function deleteHighlight(db: LearnerDb, id: string): Promise<void> {
  await db.highlights.delete(id)
}

/** Subrayados de una lección, en el orden en que aparecen en el texto. */
export async function lessonHighlights(db: LearnerDb, lessonId: string): Promise<Highlight[]> {
  const list = await db.highlights.where('lessonId').equals(lessonId).toArray()
  return list.sort((a, b) => a.position - b.position)
}

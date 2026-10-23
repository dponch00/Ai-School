// Notas y marcadores (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { openDb, type LearnerDb } from './db'
import { getNote, isBookmarked, MAX_NOTE, saveNote, toggleBookmark } from './notes'
import { exportBackup, parseBackup } from './backup'

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-notes-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

describe('notas y marcadores', () => {
  it('una nota se crea, se actualiza en el mismo registro y se borra si queda vacía', async () => {
    const a = await saveNote(db, 'm02-l3', 'Repasar invariantes')
    const b = await saveNote(db, 'm02-l3', 'Repasar invariantes y contratos')
    expect(b!.id).toBe(a!.id)
    expect((await getNote(db, 'm02-l3'))!.text).toBe('Repasar invariantes y contratos')
    expect(await saveNote(db, 'm02-l3', '   ')).toBeNull()
    expect(await getNote(db, 'm02-l3')).toBeUndefined()
  })

  it('una nota más larga que el límite se recorta al límite', async () => {
    const note = await saveNote(db, 'm02-l1', 'x'.repeat(MAX_NOTE + 50))
    expect(note!.text).toHaveLength(MAX_NOTE)
  })

  it('el marcador se alterna', async () => {
    expect(await toggleBookmark(db, 'm02-l2')).toBe(true)
    expect(await isBookmarked(db, 'm02-l2')).toBe(true)
    expect(await toggleBookmark(db, 'm02-l2')).toBe(false)
    expect(await isBookmarked(db, 'm02-l2')).toBe(false)
  })

  it('notas y marcadores viajan en el respaldo y pasan su validación', async () => {
    await saveNote(db, 'm02-l3', 'nota')
    await toggleBookmark(db, 'm02-l4')
    const b = parseBackup(JSON.stringify(await exportBackup(db, '0.1.0', {})))
    expect(b.notes).toHaveLength(1)
    expect(b.bookmarks).toHaveLength(1)
  })
})

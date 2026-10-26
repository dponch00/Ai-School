// Subrayados con nota (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { openDb, type LearnerDb } from './db'
import { addHighlight, deleteHighlight, lessonHighlights, MAX_HIGHLIGHT_NOTE, mergeHighlights, updateHighlight, type NewHighlight } from './highlights'
import { exportBackup, parseBackup, restoreBackup } from './backup'

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-hl-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

const base = (over: Partial<NewHighlight> = {}): NewHighlight => ({
  courseId: 'm02',
  lessonId: 'm02-l1',
  sectionId: 'objetivo',
  sectionTitle: 'Un buen objetivo',
  quote: 'el objetivo dice quién',
  prefix: 'Un buen ',
  suffix: ', para qué',
  position: 120,
  color: 'amarillo',
  contentVersion: '1.0.0',
  ...over,
})

describe('subrayados', () => {
  it('se guardan y se listan por lección en el orden del texto', async () => {
    await addHighlight(db, base({ position: 500, quote: 'segundo' }))
    await addHighlight(db, base({ position: 10, quote: 'primero' }))
    await addHighlight(db, base({ lessonId: 'm02-l2', quote: 'otra lección' }))
    const list = await lessonHighlights(db, 'm02-l1')
    expect(list.map((h) => h.quote)).toEqual(['primero', 'segundo'])
  })

  it('el color y la nota se cambian; una nota vacía se quita', async () => {
    const h = await addHighlight(db, base())
    const a = await updateHighlight(db, h.id, { color: 'verde', note: '  Repasar antes del examen  ' })
    expect(a).toMatchObject({ color: 'verde', note: 'Repasar antes del examen' })
    const b = await updateHighlight(db, h.id, { note: '   ' })
    expect(b!.note).toBeUndefined()
    expect(b!.color).toBe('verde')
  })

  it('una nota más larga que el límite se recorta', async () => {
    const h = await addHighlight(db, base({ note: 'x'.repeat(MAX_HIGHLIGHT_NOTE + 10) }))
    expect(h.note).toHaveLength(MAX_HIGHLIGHT_NOTE)
  })

  it('se borra', async () => {
    const h = await addHighlight(db, base())
    await deleteHighlight(db, h.id)
    expect(await lessonHighlights(db, 'm02-l1')).toEqual([])
  })

  it('dos subrayados que se cruzan se unen en uno, con las dos notas', async () => {
    const a = await addHighlight(db, base({ position: 100, quote: 'el objetivo', color: 'verde', note: 'primera' }))
    const b = await addHighlight(db, base({ position: 104, quote: 'objetivo dice quién', note: 'segunda' }))
    const anchor = { quote: 'el objetivo dice quién', prefix: 'Un buen ', suffix: ', para qué', position: 100, sectionId: 'objetivo', sectionTitle: 'Un buen objetivo', contentVersion: '1.0.0' }
    const merged = await mergeHighlights(db, a.id, [b.id], anchor)
    expect(merged).toMatchObject({ id: a.id, color: 'verde', quote: 'el objetivo dice quién', note: 'primera\n\nsegunda' })
    expect((await lessonHighlights(db, 'm02-l1')).map((h) => h.id)).toEqual([a.id])
  })

  it('viaja en el respaldo y se restaura', async () => {
    await addHighlight(db, base({ note: 'una nota' }))
    const backup = parseBackup(JSON.stringify(await exportBackup(db, '0.1.0', {})))
    const other = openDb(`ai-school-hl-restore-${n}`)
    await restoreBackup(other, backup)
    expect((await lessonHighlights(other, 'm02-l1'))[0]).toMatchObject({ quote: 'el objetivo dice quién', note: 'una nota' })
    await other.delete()
  })
})

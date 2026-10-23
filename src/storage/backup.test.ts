// Respaldo completo: ida y vuelta, validación y migración (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeQuestion } from '../domain/fixtures.test-utils'
import { APP_VERSION } from '../app/version'
import { openDb, type LearnerDb } from './db'
import { MAX_BACKUP_BYTES, backupSummary, exportBackup, parseBackup, readBackupFile, restoreBackup } from './backup'
import { recordCheckAnswer } from './progress'

let a: LearnerDb
let b: LearnerDb
let n = 0
beforeEach(() => {
  a = openDb(`ai-school-bk-a-${++n}`)
  b = openDb(`ai-school-bk-b-${n}`)
})
afterEach(async () => {
  await a.delete()
  await b.delete()
})

async function seed(db: LearnerDb) {
  const round = { courseId: 'm02', lessonId: 'm02-l1', purpose: 'checks' as const, contentVersion: '0.1.0', size: 1 }
  await recordCheckAnswer(db, round, null, makeQuestion({ id: 'm02-l1-c1', use: 'check' }), ['k1', 'd1', 'd2'], 'k1', { confidence: 'high' })
  await db.notes.put({ id: 'nota-000001', targetId: 'm02-l1', text: 'mi nota', updatedAt: '2026-10-22T10:00:00.000Z' })
}

describe('respaldo', () => {
  it('exporta y restaura en otra base: respuestas, progreso y notas', async () => {
    await seed(a)
    const text = JSON.stringify(await exportBackup(a, '0.1.0', { m02: '0.1.0' }))
    const parsed = parseBackup(text)
    expect(backupSummary(parsed)).toMatchObject({ hasProfile: false, attempts: 1, responses: 1 })
    await restoreBackup(b, parsed)
    expect((await b.responses.toArray())[0].confidence).toBe('high')
    expect(await b.lessonProgress.count()).toBe(1)
    expect((await b.notes.toArray())[0].text).toBe('mi nota')
  })

  it('restaurar reemplaza lo que había, no lo mezcla', async () => {
    await seed(a)
    await seed(b)
    await seed(b)
    await restoreBackup(b, parseBackup(JSON.stringify(await exportBackup(a, '0.1.0', {}))))
    expect(await b.attempts.count()).toBe(1)
  })

  it('exporta con la versión real de la app (debe ser semántica)', async () => {
    await expect(exportBackup(a, APP_VERSION, {})).resolves.toMatchObject({ appVersion: APP_VERSION })
  })

  it('sin perfil también se respalda', async () => {
    const bk = await exportBackup(a, '0.1.0', {})
    expect(bk.profile).toBeNull()
    expect(() => parseBackup(JSON.stringify(bk))).not.toThrow()
  })

  it('rechaza con un mensaje claro lo que no es un respaldo', () => {
    expect(() => parseBackup('no es json')).toThrow('no es un JSON válido')
    expect(() => parseBackup('{"hola":1}')).toThrow('versión de esquema')
    expect(() => parseBackup(JSON.stringify({ schemaVersion: 99 }))).toThrow('más nueva')
    expect(() => parseBackup(JSON.stringify({ schemaVersion: 2, exportedAt: 'ayer' }))).toThrow('no pasa la validación')
  })

  it('migra un respaldo de la versión 1, que no tenía reportes', async () => {
    await seed(a)
    const v1 = { ...(await exportBackup(a, '0.1.0', {})), schemaVersion: 1 } as Record<string, unknown>
    delete v1.reports
    const parsed = parseBackup(JSON.stringify(v1))
    expect(parsed.schemaVersion).toBe(2)
    expect(parsed.reports).toEqual([])
  })
  it('un archivo más grande que el límite se rechaza sin leerlo (T014-S04)', async () => {
    const text = vi.fn(async () => '{}')
    await expect(readBackupFile({ size: MAX_BACKUP_BYTES + 1, text })).rejects.toThrow('demasiado grande')
    expect(text).not.toHaveBeenCalled()
  })
})

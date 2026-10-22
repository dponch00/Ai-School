// Estado del almacenamiento (F2-09).
import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { openDb } from './db'
import { checkStorage, requestPersistence } from './health'

const fakeStorage = (persisted: boolean, grant: boolean) => ({
  storage: {
    persisted: async () => persisted,
    persist: async () => grant,
    estimate: async () => ({ usage: 2048, quota: 1_000_000 }),
  } as unknown as StorageManager,
})

describe('almacenamiento', () => {
  it('con IndexedDB disponible informa uso, cuota y persistencia', async () => {
    const db = openDb('ai-school-health-1')
    expect(await checkStorage(db, fakeStorage(false, true))).toEqual({ available: true, persisted: false, usageBytes: 2048, quotaBytes: 1_000_000 })
    await db.delete()
  })

  it('si la base no abre, lo dice en vez de fingir que guarda', async () => {
    const db = openDb('ai-school-health-2')
    db.open = (async () => {
      throw new Error('bloqueado por el navegador')
    }) as unknown as typeof db.open
    const h = await checkStorage(db, undefined)
    expect(h).toMatchObject({ available: false, persisted: null, error: 'bloqueado por el navegador' })
  })

  it('pedir persistencia devuelve lo que conceda el navegador, o null si no lo admite', async () => {
    expect(await requestPersistence(fakeStorage(false, true))).toBe(true)
    expect(await requestPersistence(fakeStorage(false, false))).toBe(false)
    expect(await requestPersistence({ storage: {} as StorageManager })).toBeNull()
  })
})

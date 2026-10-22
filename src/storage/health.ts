/**
 * Estado del almacenamiento local (F2-09). Si IndexedDB no está disponible (navegación privada, datos del
 * sitio bloqueados), la app sigue sirviendo para leer, pero lo dice en vez de fingir que guarda.
 */
import type { LearnerDb } from './db'

export interface StorageHealth {
  available: boolean
  /** true si el navegador se comprometió a no borrar estos datos por falta de espacio. */
  persisted: boolean | null
  usageBytes: number | null
  quotaBytes: number | null
  error?: string
}

export async function checkStorage(db: LearnerDb, nav: Pick<Navigator, 'storage'> | undefined = globalThis.navigator): Promise<StorageHealth> {
  let available = true
  let error: string | undefined
  try {
    await db.open()
    await db.lessonProgress.count()
  } catch (e) {
    available = false
    error = e instanceof Error ? e.message : String(e)
  }
  const storage = nav?.storage
  const persisted = storage?.persisted ? await storage.persisted().catch(() => null) : null
  const estimate = storage?.estimate ? await storage.estimate().catch(() => null) : null
  return { available, persisted, usageBytes: estimate?.usage ?? null, quotaBytes: estimate?.quota ?? null, ...(error ? { error } : {}) }
}

/** Pide al navegador que no borre los datos; devuelve si lo concedió (o null si no lo admite). */
export async function requestPersistence(nav: Pick<Navigator, 'storage'> | undefined = globalThis.navigator): Promise<boolean | null> {
  if (!nav?.storage?.persist) return null
  return nav.storage.persist().catch(() => false)
}

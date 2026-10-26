/**
 * Respaldo completo del progreso (plan §9 y §17.3, F1-10): un JSON versionado que se puede
 * guardar fuera del navegador y restaurar en otro dispositivo. Desde D-024 la app ya no escribe perfil,
 * entregas, retroalimentación ni reportes, pero el respaldo conserva esas tablas para no perder datos antiguos.
 */
import { Backup, SCHEMA_VERSION } from '../domain/learner'
import type { LearnerDb } from './db'
import { now } from './progress'

/** Un respaldo más grande que esto no es el progreso de una persona: se rechaza antes de leerlo. */
export const MAX_BACKUP_BYTES = 20 * 1024 * 1024

export async function exportBackup(db: LearnerDb, appVersion: string, contentVersions: Record<string, string>, at = now()): Promise<Backup> {
  return db.transaction('r', [db.profile, db.attempts, db.responses, db.practiceSubmissions, db.feedback, db.adjustments, db.notes, db.bookmarks, db.lessonProgress, db.reports, db.highlights], async () =>
    Backup.parse({
      schemaVersion: SCHEMA_VERSION,
      exportedAt: at,
      appVersion,
      contentVersions,
      profile: (await db.profile.toCollection().first()) ?? null,
      attempts: await db.attempts.toArray(),
      responses: await db.responses.toArray(),
      practiceSubmissions: await db.practiceSubmissions.toArray(),
      feedback: await db.feedback.toArray(),
      adjustments: await db.adjustments.toArray(),
      notes: await db.notes.toArray(),
      bookmarks: await db.bookmarks.toArray(),
      lessonProgress: await db.lessonProgress.toArray(),
      reports: await db.reports.toArray(),
      highlights: await db.highlights.toArray(),
    }),
  )
}

export function backupFileName(at: string): string {
  return `ai-school-respaldo_${at.slice(0, 10)}.json`
}

/**
 * Lee y valida un respaldo. Los de versiones anteriores se migran (la v1 no tenía reportes; la v2, subrayados).
 * Lanza un error en español si el archivo no sirve; nunca devuelve algo a medio validar.
 */
export function parseBackup(text: string): Backup {
  if (new Blob([text]).size > MAX_BACKUP_BYTES) throw new Error('El archivo es demasiado grande para ser un respaldo de AI School.')
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }
  if (!raw || typeof raw !== 'object') throw new Error('El archivo no tiene la forma de un respaldo.')
  const obj = raw as Record<string, unknown>
  if (typeof obj.schemaVersion !== 'number') throw new Error('Al archivo le falta la versión de esquema: no parece un respaldo de AI School.')
  if (obj.schemaVersion > SCHEMA_VERSION) throw new Error(`El respaldo es de una versión más nueva de la app (esquema ${obj.schemaVersion}). Actualiza la app antes de restaurarlo.`)
  const migrated = obj.schemaVersion < SCHEMA_VERSION ? { reports: [], highlights: [], ...obj, schemaVersion: SCHEMA_VERSION } : obj
  const parsed = Backup.safeParse(migrated)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    throw new Error(`El respaldo no pasa la validación (${first.path.join('.') || 'raíz'}: ${first.message}).`)
  }
  return parsed.data
}

/** Lee un archivo de respaldo: rechaza por tamaño antes de cargarlo en memoria (T014-S04). */
export async function readBackupFile(file: Pick<Blob, 'size' | 'text'>): Promise<Backup> {
  if (file.size > MAX_BACKUP_BYTES) throw new Error('El archivo es demasiado grande para ser un respaldo de AI School.')
  return parseBackup(await file.text())
}

export function backupSummary(b: Backup) {
  return {
    exportedAt: b.exportedAt,
    appVersion: b.appVersion,
    hasProfile: b.profile !== null,
    attempts: b.attempts.length,
    responses: b.responses.length,
    practiceSubmissions: b.practiceSubmissions.length,
    feedback: b.feedback.length,
    reports: b.reports.length,
  }
}

/** Restaura un respaldo ya validado: reemplaza todo lo guardado en este navegador, en una sola transacción. */
export async function restoreBackup(db: LearnerDb, b: Backup): Promise<void> {
  const tables = [db.profile, db.attempts, db.responses, db.practiceSubmissions, db.feedback, db.adjustments, db.notes, db.bookmarks, db.lessonProgress, db.reports, db.highlights]
  await db.transaction('rw', tables, async () => {
    for (const t of tables) await t.clear()
    if (b.profile) await db.profile.put(b.profile)
    await db.attempts.bulkPut(b.attempts)
    await db.responses.bulkPut(b.responses)
    await db.practiceSubmissions.bulkPut(b.practiceSubmissions)
    await db.feedback.bulkPut(b.feedback)
    await db.adjustments.bulkPut(b.adjustments)
    await db.notes.bulkPut(b.notes)
    await db.bookmarks.bulkPut(b.bookmarks)
    await db.lessonProgress.bulkPut(b.lessonProgress)
    await db.reports.bulkPut(b.reports)
    await db.highlights.bulkPut(b.highlights)
  })
}

/**
 * Perfil, entregas de práctica y reportes. Cada escritura pasa por su contrato Zod.
 */
import type { Practice } from '../domain/content'
import { PracticeSubmission, Profile, ReportRecord, reviewState } from '../domain/learner'
import type { LearnerDb } from './db'
import { newLocalId, now } from './progress'

// ---------- Perfil ----------

export async function getProfile(db: LearnerDb): Promise<Profile | undefined> {
  return (await db.profile.toArray())[0]
}

/** Guarda el perfil; el ID local se crea la primera vez y no cambia. */
export async function saveProfile(
  db: LearnerDb,
  data: Pick<Profile, 'declared' | 'priorEvidence'>,
  at = now(),
): Promise<Profile> {
  return db.transaction('rw', db.profile, async () => {
    const prev = await getProfile(db)
    const next = Profile.parse({ localId: prev?.localId ?? `perfil-${newLocalId().slice(0, 12)}`, updatedAt: at, ...data })
    await db.profile.put(next)
    return next
  })
}

// ---------- Entrega de práctica ----------

export async function getSubmission(db: LearnerDb, practiceId: string): Promise<PracticeSubmission | undefined> {
  const all = await db.practiceSubmissions.where('practiceId').equals(practiceId).toArray()
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).at(-1)
}

export type SubmissionDraft = Pick<PracticeSubmission, 'text' | 'evidence' | 'notebook' | 'selfAssessment'>

/**
 * Guarda la entrega de la versión vigente de la práctica. El estado no lo elige el alumno:
 * se calcula con las reglas de `reviewState` (presentada, autoevaluada, revisión pendiente, revisada).
 */
export async function saveSubmission(db: LearnerDb, practice: Practice, draft: SubmissionDraft, at = now()): Promise<PracticeSubmission> {
  return db.transaction('rw', db.practiceSubmissions, async () => {
    const prev = await getSubmission(db, practice.id)
    const same = prev && prev.practiceVersion === practice.version ? prev : undefined
    const reviews = same?.reviews ?? []
    const state = reviewState(
      { ...draft, reviews },
      { criterionIds: practice.rubric.map((c) => c.id), transferNotebook: practice.transferNotebook },
    )
    const next = PracticeSubmission.parse({
      id: same?.id ?? newLocalId(),
      practiceId: practice.id,
      practiceVersion: practice.version,
      createdAt: same?.createdAt ?? at,
      ...draft,
      reviews,
      state,
    })
    await db.practiceSubmissions.put(next)
    return next
  })
}

// ---------- Reportes ----------

export async function saveReport(db: LearnerDb, record: ReportRecord): Promise<void> {
  await db.reports.put(ReportRecord.parse(record))
}

export async function listReports(db: LearnerDb): Promise<ReportRecord[]> {
  return db.reports.orderBy('createdAt').toArray()
}

/** Todo lo que un reporte puede necesitar, leído en una sola transacción. */
export async function loadRecord(db: LearnerDb) {
  return db.transaction('r', [db.profile, db.attempts, db.responses, db.practiceSubmissions, db.feedback, db.adjustments, db.reports], async () => ({
    profile: await getProfile(db),
    attempts: await db.attempts.toArray(),
    responses: await db.responses.toArray(),
    submissions: await db.practiceSubmissions.toArray(),
    feedback: await db.feedback.toArray(),
    adjustments: await db.adjustments.toArray(),
    reports: await listReports(db),
  }))
}
export type LearnerRecord = Awaited<ReturnType<typeof loadRecord>>

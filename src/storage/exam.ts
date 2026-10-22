/**
 * Examen de un manual (F1-08): selección con cobertura, respuestas que se guardan mientras
 * se responde, envío con resultado congelado y reintentos con variantes nuevas.
 */
import type { Question } from '../domain/content'
import { Attempt, Response, finalSelection } from '../domain/learner'
import { DEFAULT_PASS_RULE, type Rng, scoreAttempt, selectExam } from '../domain/scoring'
import type { LearnerDb } from './db'
import { newLocalId, now } from './progress'

export interface ExamCourse {
  id: string
  version: string
  evaluatedObjectiveIds: string[]
  /** Curso piloto sin publicar: el examen usa los ítems en borrador. */
  pilot?: boolean
}

export const ITEMS_PER_OBJECTIVE = 2
export const examLabel = (course: Pick<ExamCourse, 'id' | 'version'>) => `examen ${course.id} v${course.version}`

/** Intentos de examen del curso, del más antiguo al más reciente. */
export async function examAttempts(db: LearnerDb, courseId: string): Promise<Attempt[]> {
  const all = await db.attempts.where('courseId').equals(courseId).toArray()
  return all.filter((a) => a.kind === 'exam').sort((a, b) => a.startedAt.localeCompare(b.startedAt))
}

/**
 * Devuelve el examen en curso o arma uno nuevo. En un reintento, cada familia fallada
 * cambia de variante y se prefieren variantes que no se hayan visto.
 */
export async function startExam(db: LearnerDb, course: ExamCourse, bank: Question[], rng: Rng = Math.random, at = now()): Promise<Attempt> {
  return db.transaction('rw', [db.attempts, db.responses], async () => {
    const previous = await examAttempts(db, course.id)
    const open = previous.find((a) => a.status === 'in-progress')
    if (open) return open

    const submitted = previous.filter((a) => a.status === 'submitted')
    const usedVariantsByFamily: Record<string, string[]> = {}
    for (const a of submitted) {
      for (const { question } of a.items) {
        if (question.family && question.variant) (usedVariantsByFamily[question.family] ??= []).push(question.variant)
      }
    }
    const last = submitted.at(-1)
    const failedFamilies = last ? await failedFamiliesOf(db, last) : []
    const items = selectExam({ bank, evaluatedObjectiveIds: course.evaluatedObjectiveIds, itemsPerObjective: ITEMS_PER_OBJECTIVE, rng, usedVariantsByFamily, failedFamilies, allowDraft: course.pilot })

    const attempt = Attempt.parse({
      id: newLocalId(),
      kind: 'exam',
      courseId: course.id,
      contentVersion: course.version,
      formLabel: examLabel(course),
      isFirstAttempt: submitted.length === 0,
      startedAt: at,
      status: 'in-progress',
      items,
    })
    await db.attempts.put(attempt)
    return attempt
  })
}

async function failedFamiliesOf(db: LearnerDb, attempt: Attempt): Promise<string[]> {
  const responses = await db.responses.where('attemptId').equals(attempt.id).toArray()
  return attempt.items
    .filter(({ question }) => {
      const r = responses.find((x) => x.questionId === question.id)
      const key = question.options.find((o) => o.correct)?.id
      return !r || r.status !== 'submitted' || finalSelection(r) !== key
    })
    .map(({ question }) => question.family!)
}

/**
 * Guarda una selección mientras el examen está abierto. La primera selección nunca se borra;
 * los cambios posteriores quedan como revisiones.
 */
export async function selectExamAnswer(db: LearnerDb, attemptId: string, questionId: string, optionId: string, at = now()): Promise<void> {
  await db.transaction('rw', [db.attempts, db.responses], async () => {
    const attempt = await db.attempts.get(attemptId)
    if (!attempt || attempt.status !== 'in-progress') throw new Error('El examen ya no está abierto')
    const item = attempt.items.find((it) => it.question.id === questionId)
    if (!item || !item.shownOptionIds.includes(optionId)) throw new Error('La opción no pertenece a este examen')
    const existing = (await db.responses.where('attemptId').equals(attemptId).toArray()).find((r) => r.questionId === questionId)
    if (!existing) {
      await db.responses.put(
        Response.parse({
          id: newLocalId(),
          attemptId,
          questionId,
          questionVersion: item.question.version,
          firstSelectedOptionId: optionId,
          revisions: [],
          feedbackSeenBeforeAnswer: false,
          status: 'draft',
        }),
      )
    } else if (finalSelection(existing) !== optionId) {
      await db.responses.put(Response.parse({ ...existing, revisions: [...existing.revisions, { selectedOptionId: optionId, at }] }))
    }
  })
}

/** Envía el examen: las respuestas pasan a enviadas y el resultado queda congelado con su regla. */
export async function submitExam(db: LearnerDb, attemptId: string, at = now()): Promise<Attempt> {
  return db.transaction('rw', [db.attempts, db.responses], async () => {
    const attempt = await db.attempts.get(attemptId)
    if (!attempt) throw new Error('No existe el intento')
    if (attempt.status !== 'in-progress') return attempt
    const responses = await db.responses.where('attemptId').equals(attemptId).toArray()
    const sent = responses.map((r) => Response.parse({ ...r, status: 'submitted', answeredAt: r.answeredAt ?? at }))
    await db.responses.bulkPut(sent)
    const result = scoreAttempt(attempt, sent, DEFAULT_PASS_RULE)
    const next = Attempt.parse({
      ...attempt,
      status: 'submitted',
      submittedAt: at,
      result: { correct: result.correct, total: result.total, passed: result.passed, reasons: result.reasons, rule: DEFAULT_PASS_RULE, computedAt: at },
    })
    await db.attempts.put(next)
    return next
  })
}

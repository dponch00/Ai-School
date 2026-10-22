/**
 * Operaciones sobre el progreso del alumno. Cada escritura pasa por el contrato Zod
 * correspondiente; si no cumple, se lanza el error en vez de guardar algo inválido.
 */
import type { Question } from '../domain/content'
import { Attempt, LessonProgress, Response, finalSelection } from '../domain/learner'
import type { LearnerDb } from './db'

export const now = () => new Date().toISOString()

/** ID local de 32 caracteres hexadecimales (cumple `LocalId`). */
export const newLocalId = () => crypto.randomUUID().replaceAll('-', '')

const progressKey = (courseId: string, lessonId: string) => `${courseId}/${lessonId}`

export async function markLessonVisited(db: LearnerDb, courseId: string, lessonId: string, at = now()): Promise<void> {
  const key = progressKey(courseId, lessonId)
  await db.transaction('rw', db.lessonProgress, async () => {
    const prev = await db.lessonProgress.get(key)
    await db.lessonProgress.put(LessonProgress.parse({ ...(prev ?? { key, courseId, lessonId, firstVisitedAt: at }), lastVisitedAt: at }))
  })
}

/** Una ronda de preguntas mostrada en una visita: comprobaciones o repaso de una lección. */
export interface CheckRound {
  courseId: string
  lessonId: string
  /** `checks` cuenta para el progreso de la lección; `review` es el repaso de lecciones anteriores; `practice`, el modo práctica del curso. */
  purpose: 'checks' | 'review' | 'practice'
  contentVersion: string
  /** Cuántas preguntas tiene la ronda: al responderlas todas, el intento se envía. */
  size: number
}

const LABELS = { checks: 'comprobaciones', review: 'repaso', practice: 'práctica' } as const
export const roundLabel = (r: Pick<CheckRound, 'lessonId' | 'purpose'>) => `${LABELS[r.purpose]} ${r.lessonId}`

/**
 * Guarda una respuesta de comprobación con la pregunta congelada tal como se mostró.
 * La primera respuesta de la ronda crea el intento; las siguientes lo amplían.
 * Devuelve el ID del intento para que la visita siga usándolo.
 */
export async function recordCheckAnswer(
  db: LearnerDb,
  round: CheckRound,
  attemptId: string | null,
  question: Question,
  shownOptionIds: string[],
  selectedOptionId: string,
  at = now(),
): Promise<string> {
  return db.transaction('rw', [db.attempts, db.responses, db.lessonProgress], async () => {
    const formLabel = roundLabel(round)
    let attempt = attemptId ? await db.attempts.get(attemptId) : undefined
    if (!attempt) {
      const previous = await db.attempts.where('formLabel').equals(formLabel).count()
      attempt = {
        id: newLocalId(),
        kind: round.purpose === 'practice' ? 'practice' : 'check',
        courseId: round.courseId,
        contentVersion: round.contentVersion,
        formLabel,
        isFirstAttempt: previous === 0,
        startedAt: at,
        status: 'in-progress',
        items: [],
      } as unknown as Attempt
    }
    if (attempt.items.some((it) => it.question.id === question.id)) return attempt.id

    const items = [...attempt.items, { question, shownOptionIds }]
    const complete = items.length >= round.size
    const next = Attempt.parse({ ...attempt, items, ...(complete ? { status: 'submitted', submittedAt: at } : {}) })
    await db.attempts.put(next)
    await db.responses.put(
      Response.parse({
        id: newLocalId(),
        attemptId: next.id,
        questionId: question.id,
        questionVersion: question.version,
        firstSelectedOptionId: selectedOptionId,
        revisions: [],
        feedbackSeenBeforeAnswer: false,
        status: 'submitted',
        answeredAt: at,
      }),
    )

    if (complete && round.purpose === 'checks') {
      const { correct, total } = await scoreRound(db, next)
      const key = progressKey(round.courseId, round.lessonId)
      const prev = await db.lessonProgress.get(key)
      const base = prev ?? { key, courseId: round.courseId, lessonId: round.lessonId, firstVisitedAt: at, lastVisitedAt: at }
      await db.lessonProgress.put(
        LessonProgress.parse({ ...base, checksCompletedAt: base.checksCompletedAt ?? at, lastCheck: { correct, total, at } }),
      )
    }
    return next.id
  })
}

/** Aciertos de un intento según sus instantáneas congeladas, nunca según el banco actual. */
export async function scoreRound(db: LearnerDb, attempt: Attempt): Promise<{ correct: number; total: number }> {
  const responses = await db.responses.where('attemptId').equals(attempt.id).toArray()
  let correct = 0
  for (const it of attempt.items) {
    const r = responses.find((x) => x.questionId === it.question.id)
    const key = it.question.options.find((o) => o.correct)?.id
    if (r && finalSelection(r) === key) correct++
  }
  return { correct, total: attempt.items.length }
}

export function courseProgress(db: LearnerDb, courseId: string): Promise<LessonProgress[]> {
  return db.lessonProgress.where('courseId').equals(courseId).toArray()
}

export function lessonProgress(db: LearnerDb, courseId: string, lessonId: string): Promise<LessonProgress | undefined> {
  return db.lessonProgress.get(progressKey(courseId, lessonId))
}

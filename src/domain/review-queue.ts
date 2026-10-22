/**
 * Repaso de errores con confianza alta (estándar §4.3, R-E-4 y R-E-5): un error cometido con
 * seguridad vuelve en la sesión siguiente (al día siguiente) y otra vez más adelante (a los 7 días).
 * Dos aciertos seguidos lo sacan de la cola; un nuevo error lo devuelve al día siguiente.
 * Función pura: se calcula a partir de los intentos guardados, sin tabla propia.
 */
import type { Question } from './content'
import { finalSelection, type Attempt, type Response } from './learner'

export const ERROR_REVIEW_PREFIX = 'repaso de errores'
export const errorReviewLabel = (courseId: string) => `${ERROR_REVIEW_PREFIX} ${courseId}`

const DAY_MS = 86_400_000
/** Intervalos después de cada acierto: 1 día hasta el primer acierto, 7 días hasta el segundo. */
const STEPS_DAYS = [1, 7]

export interface ReviewItem {
  questionId: string
  /** La pregunta tal como se vio cuando se cometió el error (instantánea congelada). */
  question: Question
  /** Cuándo se cometió el error con confianza alta que abrió el repaso. */
  sourceAt: string
  sourceKind: Attempt['kind']
  dueAt: string
  /** Aciertos seguidos en el repaso (0 o 1; con 2 sale de la cola). */
  streak: number
}

export interface ReviewQueue {
  due: ReviewItem[]
  upcoming: ReviewItem[]
  resolved: number
}

const t = (iso: string) => Date.parse(iso)
const plusDays = (iso: string, days: number) => new Date(t(iso) + days * DAY_MS).toISOString()
const keyOf = (q: Question) => q.options.find((o) => o.correct)?.id

export function errorReviewQueue(attempts: Attempt[], responses: Response[], courseId: string, at: string): ReviewQueue {
  const label = errorReviewLabel(courseId)
  const byAttempt = new Map(attempts.map((a) => [a.id, a]))
  const sources = new Map<string, { question: Question; at: string; kind: Attempt['kind'] }>()
  const reviews = new Map<string, { at: string; correct: boolean }[]>()

  for (const r of responses) {
    const a = byAttempt.get(r.attemptId)
    if (!a || a.courseId !== courseId || r.status !== 'submitted' || !r.answeredAt) continue
    const item = a.items.find((it) => it.question.id === r.questionId)
    if (!item) continue
    const correct = finalSelection(r) === keyOf(item.question)
    if (a.formLabel === label) {
      const list = reviews.get(r.questionId) ?? []
      list.push({ at: r.answeredAt, correct })
      reviews.set(r.questionId, list)
    } else if (!correct && r.confidence === 'high') {
      // Si se repite el error con seguridad, cuenta el más reciente.
      const prev = sources.get(r.questionId)
      if (!prev || t(r.answeredAt) > t(prev.at)) sources.set(r.questionId, { question: item.question, at: r.answeredAt, kind: a.kind })
    }
  }

  const queue: ReviewQueue = { due: [], upcoming: [], resolved: 0 }
  for (const [questionId, src] of sources) {
    let streak = 0
    let dueAt = plusDays(src.at, STEPS_DAYS[0])
    const after = (reviews.get(questionId) ?? []).filter((x) => t(x.at) > t(src.at)).sort((x, y) => t(x.at) - t(y.at))
    let resolved = false
    for (const x of after) {
      if (x.correct) {
        streak++
        if (streak >= STEPS_DAYS.length) {
          resolved = true
          break
        }
        dueAt = plusDays(x.at, STEPS_DAYS[streak])
      } else {
        streak = 0
        dueAt = plusDays(x.at, STEPS_DAYS[0])
      }
    }
    if (resolved) {
      queue.resolved++
      continue
    }
    const item: ReviewItem = { questionId, question: src.question, sourceAt: src.at, sourceKind: src.kind, dueAt, streak }
    ;(t(dueAt) <= t(at) ? queue.due : queue.upcoming).push(item)
  }
  queue.due.sort((x, y) => t(x.dueAt) - t(y.dueAt))
  queue.upcoming.sort((x, y) => t(x.dueAt) - t(y.dueAt))
  return queue
}

/**
 * Selección y corrección de exámenes, y señales del diagnóstico.
 * Funciones puras: todo lo que necesitan llega por parámetro (incluido el azar).
 *
 * Reglas: docs/content-standard.md §4.3 y docs/curriculum.md §2.1 (D-015 a D-017).
 */
import type { Question } from './content'
import type { Attempt, ItemSnapshot, Response } from './learner'
import { finalSelection } from './learner'

export type Rng = () => number

// ---------- Selección del examen ----------

export interface SelectionInput {
  bank: Question[]
  /** Objetivos evaluados del manual, en orden (máximo 6, D-017). */
  evaluatedObjectiveIds: string[]
  itemsPerObjective: number
  rng: Rng
  /** Variantes ya usadas por familia en intentos anteriores. */
  usedVariantsByFamily?: Record<string, string[]>
  /** Familias falladas en el intento anterior: deben cambiar de variante. */
  failedFamilies?: string[]
}

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)]
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Elige `itemsPerObjective` familias por objetivo y una variante por familia.
 * Las familias falladas cambian de variante; si no queda ninguna nueva, se lanza un error
 * en vez de repetir en silencio (la equivalencia de variantes es supuesta, ver §4.2).
 */
export function selectExam(input: SelectionInput): ItemSnapshot[] {
  const { bank, evaluatedObjectiveIds, itemsPerObjective, rng } = input
  const used = input.usedVariantsByFamily ?? {}
  const failed = new Set(input.failedFamilies ?? [])
  const examItems = bank.filter((q) => q.use === 'exam' && q.status === 'published')
  const snapshots: ItemSnapshot[] = []

  for (const objectiveId of evaluatedObjectiveIds) {
    const families = [...new Set(examItems.filter((q) => q.evaluatedObjectiveId === objectiveId).map((q) => q.family!))]
    if (families.length < itemsPerObjective) {
      throw new Error(`El objetivo ${objectiveId} tiene ${families.length} familias publicadas; se necesitan ${itemsPerObjective}`)
    }
    for (const family of shuffle(families, rng).slice(0, itemsPerObjective)) {
      const variants = examItems.filter((q) => q.family === family)
      const unseen = variants.filter((q) => !(used[family] ?? []).includes(q.variant!))
      let pool = variants
      if (failed.has(family)) {
        if (unseen.length === 0) throw new Error(`La familia ${family} se falló y no le quedan variantes sin ver`)
        pool = unseen
      } else if (unseen.length > 0) {
        pool = unseen
      }
      const question = pick(pool, rng)
      const ids = question.options.map((o) => o.id)
      snapshots.push({ question, shownOptionIds: question.fixedOrder ? ids : shuffle(ids, rng) })
    }
  }
  return shuffle(snapshots, rng)
}

// ---------- Corrección ----------

export interface ObjectiveResult {
  objectiveId: string
  correct: number
  total: number
}

export interface ExamResult {
  correct: number
  total: number
  passed: boolean
  /** Por qué no aprobó, en lenguaje para el alumno. Vacío si aprobó. */
  reasons: string[]
  byObjective: ObjectiveResult[]
  /** IDs de pregunta sin respuesta enviada: cuentan como no acertadas, no como error de concepto. */
  unanswered: string[]
}

export interface PassRule {
  minCorrect: number
  /** Ningún objetivo evaluado con todos sus ítems fallados (content-standard §4.3). */
  requireEachObjective: boolean
}

export const DEFAULT_PASS_RULE: PassRule = { minCorrect: 10, requireEachObjective: true }

/**
 * Puntúa contra la instantánea guardada en el intento, nunca contra el banco actual.
 */
export function scoreAttempt(attempt: Attempt, responses: Response[], rule: PassRule = DEFAULT_PASS_RULE): ExamResult {
  const byQuestion = new Map(responses.filter((r) => r.attemptId === attempt.id).map((r) => [r.questionId, r]))
  const objectives = new Map<string, ObjectiveResult>()
  const unanswered: string[] = []
  let correct = 0

  for (const { question } of attempt.items) {
    const response = byQuestion.get(question.id)
    const key = question.options.find((o) => o.correct)!.id
    const selected = response && response.status === 'submitted' ? finalSelection(response) : null
    if (selected === null) unanswered.push(question.id)
    const ok = selected === key
    if (ok) correct++
    const objectiveId = question.evaluatedObjectiveId ?? '(sin objetivo)'
    const entry = objectives.get(objectiveId) ?? { objectiveId, correct: 0, total: 0 }
    entry.total++
    if (ok) entry.correct++
    objectives.set(objectiveId, entry)
  }

  const byObjective = [...objectives.values()]
  const reasons: string[] = []
  if (correct < rule.minCorrect) reasons.push(`${correct} de ${attempt.items.length} correctas; se necesitan ${rule.minCorrect}`)
  if (rule.requireEachObjective) {
    for (const o of byObjective) {
      if (o.correct === 0) reasons.push(`todas las preguntas del objetivo ${o.objectiveId} quedaron sin acertar`)
    }
  }
  return { correct, total: attempt.items.length, passed: reasons.length === 0, reasons, byObjective, unanswered }
}

// ---------- Señales del diagnóstico (curriculum.md §2.1) ----------

export type BlockSignal = 'likely-strength' | 'review-recommended' | 'no-clear-signal'

export interface BlockEvidence {
  item: Question
  response?: Response
}

/**
 * Reglas asimétricas de investigacion/pedagogia-evaluacion.md §4.5 [inferencia]:
 * "fortaleza" exige más condiciones porque con 4 ítems se equivoca con más frecuencia.
 */
export function diagnosticBlockSignal(evidence: BlockEvidence[], microtaskCriticalOk?: boolean): BlockSignal {
  const rows = evidence.map(({ item, response }) => {
    const key = item.options.find((o) => o.correct)!.id
    const selected = response && response.status === 'submitted' ? finalSelection(response) : null
    return { difficulty: item.difficulty, ok: selected === key, confidence: response?.confidence }
  })
  const correct = rows.filter((r) => r.ok).length
  const base = rows.filter((r) => r.difficulty === 'base')
  const advanced = rows.filter((r) => r.difficulty === 'advanced')
  const highConfidenceErrors = rows.filter((r) => !r.ok && r.confidence === 'high')

  const review =
    correct <= 1 ||
    (base.length > 0 && base.every((r) => !r.ok)) ||
    highConfidenceErrors.some((r) => r.difficulty === 'base')
  if (review) return 'review-recommended'

  const strength =
    correct >= 3 &&
    advanced.length > 0 &&
    advanced.every((r) => r.ok) &&
    highConfidenceErrors.length === 0 &&
    microtaskCriticalOk !== false
  return strength ? 'likely-strength' : 'no-clear-signal'
}

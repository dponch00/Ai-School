/**
 * Selección y corrección de exámenes, y señales del diagnóstico.
 * Funciones puras: todo lo que necesitan llega por parámetro (incluido el azar).
 *
 * Reglas: docs/content-standard.md §4.3 y docs/curriculum.md §2.1 (D-015 a D-017).
 */
import type { Question } from './content'
import type { Attempt, ItemSnapshot, Response } from './learner'
import { finalSelection, responseIssues } from './learner'

export type Rng = () => number

// ---------- Selección del examen ----------

export interface SelectionInput {
  bank: Question[]
  /** Objetivos evaluados del manual, en orden (máximo 6, D-017). */
  evaluatedObjectiveIds: string[]
  itemsPerObjective: number
  rng: Rng
  /**
   * Variantes que no se pueden repetir todavía, por familia (vistas hace menos de 30 días, R-G-4).
   * Cada slot del examen usa una variante fuera de esta lista; si no alcanza, se avisa en vez de repetir.
   */
  usedVariantsByFamily?: Record<string, string[]>
  /** Familias falladas en el intento anterior: cambian de variante (ya lo garantiza la regla anterior). */
  failedFamilies?: string[]
  /** Piloto: un curso aún no publicado arma su examen con ítems en borrador (puerta F1-13). */
  allowDraft?: boolean
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
 * Problemas estructurales de un banco de examen (CTR-03): cada familia pertenece a un
 * solo objetivo evaluado y no repite variantes. Vacío si el banco es coherente.
 */
export function bankIssues(bank: Question[]): string[] {
  const issues: string[] = []
  const objectiveByFamily = new Map<string, Set<string>>()
  const variantKeys = new Set<string>()
  for (const q of bank.filter((x) => x.use === 'exam')) {
    const set = objectiveByFamily.get(q.family!) ?? new Set<string>()
    set.add(q.evaluatedObjectiveId!)
    objectiveByFamily.set(q.family!, set)
    const key = `${q.family}/${q.variant}`
    if (variantKeys.has(key)) issues.push(`la variante ${key} está repetida`)
    variantKeys.add(key)
  }
  for (const [family, objectives] of objectiveByFamily) {
    if (objectives.size > 1) issues.push(`la familia ${family} aparece en varios objetivos: ${[...objectives].join(', ')}`)
  }
  return issues
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
  const examItems = bank.filter((q) => q.use === 'exam' && (q.status === 'published' || (input.allowDraft === true && q.status === 'draft')))
  const issues = bankIssues(examItems)
  if (issues.length > 0) throw new Error(`Banco incoherente: ${issues.join('; ')}`)
  const snapshots: ItemSnapshot[] = []

  for (const objectiveId of evaluatedObjectiveIds) {
    const families = [...new Set(examItems.filter((q) => q.evaluatedObjectiveId === objectiveId).map((q) => q.family!))]
    if (families.length < itemsPerObjective) {
      throw new Error(`El objetivo ${objectiveId} tiene ${families.length} familias publicadas; se necesitan ${itemsPerObjective}`)
    }
    const unseenOf = (family: string) =>
      examItems.filter((q) => q.family === family && q.evaluatedObjectiveId === objectiveId && !(used[family] ?? []).includes(q.variant!))
    const eligible = families.filter((f) => unseenOf(f).length > 0)
    if (eligible.length < itemsPerObjective) {
      const lost = families.filter((f) => !eligible.includes(f))
      const failedNote = lost.some((f) => failed.has(f)) ? ' (incluida una familia fallada)' : ''
      throw new Error(
        `El objetivo ${objectiveId} no tiene suficientes variantes sin ver${failedNote}. Las variantes vistas vuelven a estar disponibles 30 días después de verse.`,
      )
    }
    for (const family of shuffle(eligible, rng).slice(0, itemsPerObjective)) {
      const question = pick(unseenOf(family), rng)
      const ids = question.options.map((o) => o.id)
      snapshots.push({ question, shownOptionIds: question.fixedOrder ? ids : shuffle(ids, rng) })
    }
  }
  const families = snapshots.map((s) => s.question.family)
  if (new Set(families).size !== families.length) throw new Error('El examen seleccionado repite una familia')
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
  const issues = responseIssues(attempt, responses)
  if (issues.length > 0) throw new Error(`Datos del intento inconsistentes: ${issues.join('; ')}`)
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

export type BlockSignal = 'likely-strength' | 'review-recommended' | 'no-clear-signal' | 'incomplete-evidence'

export interface BlockEvidence {
  item: Question
  response?: Response
}

/**
 * Reglas asimétricas de investigacion/pedagogia-evaluacion.md §4.5 [inferencia]:
 * "fortaleza" exige más condiciones porque con 4 ítems se equivoca con más frecuencia.
 */
export function diagnosticBlockSignal(evidence: BlockEvidence[], microtaskCriticalOk?: boolean): BlockSignal {
  // CTR-04: sin 4 ítems del mismo bloque (2 de base y 2 avanzados) no hay señal, solo evidencia incompleta.
  const blocks = new Set(evidence.map((e) => e.item.diagnosticBlock))
  const baseCount = evidence.filter((e) => e.item.difficulty === 'base').length
  const ids = new Set(evidence.map((e) => e.item.id))
  if (evidence.length !== 4 || ids.size !== 4 || blocks.size !== 1 || blocks.has(undefined) || baseCount !== 2) {
    return 'incomplete-evidence'
  }
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

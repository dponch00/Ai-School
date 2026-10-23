/**
 * Diagnóstico inicial (F2-06, D-015): 24 preguntas de opción múltiple en 6 bloques (D-024). Da señales por bloque,
 * con conteos e incertidumbre; nunca niveles, porcentajes ni resultados por competencia.
 * Las respuestas reutilizan el examen (selectExamAnswer, setExamConfidence, submitExam); el diagnóstico no
 * guarda un «resultado» de aprobado porque no lo tiene.
 */
import type { DiagnosticForm, Question } from '../domain/content'
import { Attempt, finalSelection, type Response } from '../domain/learner'
import { diagnosticBlockSignal, type BlockSignal, type Rng } from '../domain/scoring'
import type { LearnerDb } from './db'
import { newLocalId, now } from './progress'

export const diagnosticLabel = (form: Pick<DiagnosticForm, 'version'>) => `diagnóstico v${form.version}`

function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export async function diagnosticAttempts(db: LearnerDb): Promise<Attempt[]> {
  return (await db.attempts.where('kind').equals('diagnostic').toArray()).sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt))
}

/** Devuelve el diagnóstico en curso o arma uno: preguntas agrupadas por bloque, opciones barajadas. */
export async function startDiagnostic(db: LearnerDb, form: DiagnosticForm, questions: Record<string, Question>, rng: Rng = Math.random, at = now()): Promise<Attempt> {
  return db.transaction('rw', db.attempts, async () => {
    const previous = await diagnosticAttempts(db)
    const open = previous.find((a) => a.status === 'in-progress')
    if (open) return open
    const items = form.blocks.flatMap((b) =>
      form.itemIds
        .map((id) => questions[id])
        .filter((q): q is Question => !!q && q.diagnosticBlock === b.id)
        .map((question) => {
          const ids = question.options.map((o) => o.id)
          return { question, shownOptionIds: question.fixedOrder ? ids : shuffle(ids, rng) }
        }),
    )
    const attempt = Attempt.parse({
      id: newLocalId(),
      kind: 'diagnostic',
      courseId: null,
      contentVersion: form.version,
      formLabel: diagnosticLabel(form),
      isFirstAttempt: previous.length === 0,
      startedAt: at,
      status: 'in-progress',
      items,
    })
    await db.attempts.put(attempt)
    return attempt
  })
}

// ---------- Señales por bloque ----------

export interface BlockResult {
  blockId: string
  name: string
  competencyIds: string[]
  signal: BlockSignal
  correct: number
  total: number
  baseCorrect: number
  advancedCorrect: number
  highConfidenceErrors: number
}

export function blockResults(
  form: DiagnosticForm,
  attempt: Attempt,
  responses: Response[],
): BlockResult[] {
  return form.blocks.map((b) => {
    const evidence = attempt.items
      .filter((it) => it.question.diagnosticBlock === b.id)
      .map((it) => ({ item: it.question, response: responses.find((r) => r.attemptId === attempt.id && r.questionId === it.question.id) }))
    const ok = (e: (typeof evidence)[number]) => !!e.response && e.response.status === 'submitted' && finalSelection(e.response) === e.item.options.find((o) => o.correct)?.id
    return {
      blockId: b.id,
      name: b.name,
      competencyIds: b.competencyIds,
      signal: diagnosticBlockSignal(evidence),
      correct: evidence.filter(ok).length,
      total: evidence.length,
      baseCorrect: evidence.filter((e) => e.item.difficulty === 'base' && ok(e)).length,
      advancedCorrect: evidence.filter((e) => e.item.difficulty === 'advanced' && ok(e)).length,
      highConfidenceErrors: evidence.filter((e) => !ok(e) && e.response?.confidence === 'high').length,
    }
  })
}

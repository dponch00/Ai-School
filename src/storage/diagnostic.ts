/**
 * Diagnóstico inicial (F2-06, D-015): 24 preguntas en 6 bloques y 2 microtareas. Da señales por bloque,
 * con conteos e incertidumbre; nunca niveles, porcentajes ni resultados por competencia.
 * Las respuestas reutilizan el examen (selectExamAnswer, setExamConfidence, submitExam); el diagnóstico no
 * guarda un «resultado» de aprobado porque no lo tiene.
 */
import type { DiagnosticForm, Microtask, Question } from '../domain/content'
import { Attempt, PracticeSubmission, finalSelection, reviewState, type Response } from '../domain/learner'
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

// ---------- Microtareas ----------

/** Las microtareas se guardan como una entrega con autoevaluación por la rúbrica (sin cuaderno). */
export const microtaskVersion = (m: Pick<Microtask, 'version'>) => `${m.version}.0.0`

export async function getMicrotask(db: LearnerDb, microtaskId: string): Promise<PracticeSubmission | undefined> {
  const all = await db.practiceSubmissions.where('practiceId').equals(microtaskId).toArray()
  return all.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)).at(-1)
}

export interface MicrotaskDraft {
  firstAnswer: string
  taskAnswer: string
  selfAssessment: PracticeSubmission['selfAssessment']
}

export const MICROTASK_FIRST = 'Respuesta inicial:'
export const MICROTASK_TASK = 'Tarea:'

export async function saveMicrotask(db: LearnerDb, m: Microtask, draft: MicrotaskDraft, at = now()): Promise<PracticeSubmission> {
  return db.transaction('rw', db.practiceSubmissions, async () => {
    const prev = await getMicrotask(db, m.id)
    const same = prev && prev.practiceVersion === microtaskVersion(m) ? prev : undefined
    const text = `${MICROTASK_FIRST}\n${draft.firstAnswer.trim()}\n\n${MICROTASK_TASK}\n${draft.taskAnswer.trim()}`
    const state = reviewState({ selfAssessment: draft.selfAssessment, reviews: [], notebook: undefined }, { criterionIds: m.rubric.map((c) => c.id), transferNotebook: false })
    const next = PracticeSubmission.parse({
      id: same?.id ?? newLocalId(),
      practiceId: m.id,
      practiceVersion: microtaskVersion(m),
      createdAt: same?.createdAt ?? at,
      text,
      evidence: [],
      selfAssessment: draft.selfAssessment,
      reviews: [],
      state,
    })
    await db.practiceSubmissions.put(next)
    return next
  })
}

/** Separa las dos respuestas guardadas en el texto de la entrega. */
export function splitMicrotaskText(text: string): { firstAnswer: string; taskAnswer: string } {
  const i = text.indexOf(`\n\n${MICROTASK_TASK}\n`)
  if (!text.startsWith(MICROTASK_FIRST) || i < 0) return { firstAnswer: '', taskAnswer: text }
  return { firstAnswer: text.slice(MICROTASK_FIRST.length + 1, i), taskAnswer: text.slice(i + MICROTASK_TASK.length + 3) }
}

/**
 * Criterios críticos de la microtarea según tu autoevaluación: true si todos llegan al nivel 2, false si alguno
 * queda en 1, undefined si no te autoevaluaste. Es tu juicio, no una revisión: el resultado lo dice.
 */
export function microtaskCriticalOk(m: Microtask, sub: PracticeSubmission | undefined): boolean | undefined {
  if (!sub || sub.state === 'presented') return undefined
  const critical = m.rubric.filter((c) => c.critical)
  return critical.every((c) => {
    const a = sub.selfAssessment.find((x) => x.criterionId === c.id)
    return a !== undefined && a.level !== 'insufficient-evidence' && a.level >= 2
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
  /** Solo en bloques con microtarea: lo que dice tu autoevaluación de sus criterios críticos. */
  microtask?: { id: string; title: string; criticalOk: boolean | undefined }
}

export function blockResults(
  form: DiagnosticForm,
  attempt: Attempt,
  responses: Response[],
  microtasks: { task: Microtask; submission: PracticeSubmission | undefined }[],
): BlockResult[] {
  return form.blocks.map((b) => {
    const evidence = attempt.items
      .filter((it) => it.question.diagnosticBlock === b.id)
      .map((it) => ({ item: it.question, response: responses.find((r) => r.attemptId === attempt.id && r.questionId === it.question.id) }))
    const ok = (e: (typeof evidence)[number]) => !!e.response && e.response.status === 'submitted' && finalSelection(e.response) === e.item.options.find((o) => o.correct)?.id
    const mt = microtasks.find((m) => m.task.diagnosticBlock === b.id)
    const criticalOk = mt ? microtaskCriticalOk(mt.task, mt.submission) : undefined
    return {
      blockId: b.id,
      name: b.name,
      competencyIds: b.competencyIds,
      signal: diagnosticBlockSignal(evidence, criticalOk),
      correct: evidence.filter(ok).length,
      total: evidence.length,
      baseCorrect: evidence.filter((e) => e.item.difficulty === 'base' && ok(e)).length,
      advancedCorrect: evidence.filter((e) => e.item.difficulty === 'advanced' && ok(e)).length,
      highConfidenceErrors: evidence.filter((e) => !ok(e) && e.response?.confidence === 'high').length,
      ...(mt ? { microtask: { id: mt.task.id, title: mt.task.title, criticalOk } } : {}),
    }
  })
}

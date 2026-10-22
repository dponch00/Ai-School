/**
 * Examen de un manual (F1-08, F2-01): selección con cobertura, respuestas que se guardan mientras
 * se responde, envío con resultado congelado, reintento con variantes nuevas al día siguiente y tras
 * el repaso, y comprobación de retención a 7 días (estándar §4.3).
 */
import type { Question } from '../domain/content'
import { Attempt, Response, finalSelection } from '../domain/learner'
import { DEFAULT_PASS_RULE, type PassRule, type Rng, scoreAttempt, selectExam } from '../domain/scoring'
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
/** Retención (estándar §4.3) [H]: a los 7 días o más, una variante no vista por objetivo; 5 de 6 la dan por comprobada. */
export const RETENTION_DAYS = 7
export const RETENTION_RULE: PassRule = { minCorrect: 5, requireEachObjective: false }
const DAY_MS = 86_400_000
/** Un ítem idéntico no se repite antes de 30 días (R-G-4). */
export const REPEAT_AFTER_DAYS = 30
const t = (iso: string) => Date.parse(iso)

export const examLabel = (course: Pick<ExamCourse, 'id' | 'version'>) => `examen ${course.id} v${course.version}`
export const retentionLabel = (course: Pick<ExamCourse, 'id' | 'version'>) => `retención ${course.id} v${course.version}`

const byStart = (a: Attempt, b: Attempt) => a.startedAt.localeCompare(b.startedAt)

/** Intentos de examen del curso, del más antiguo al más reciente. */
export async function examAttempts(db: LearnerDb, courseId: string): Promise<Attempt[]> {
  const all = await db.attempts.where('courseId').equals(courseId).toArray()
  return all.filter((a) => a.kind === 'exam').sort(byStart)
}

/** Exámenes y comprobaciones de retención del curso: comparten banco y no deben repetir variantes. */
export async function assessmentAttempts(db: LearnerDb, courseId: string): Promise<Attempt[]> {
  const all = await db.attempts.where('courseId').equals(courseId).toArray()
  return all.filter((a) => a.kind === 'exam' || a.kind === 'retention').sort(byStart)
}

/** Medianoche local del día siguiente a `iso`. */
export function nextLocalDay(iso: string): string {
  const d = new Date(iso)
  d.setHours(24, 0, 0, 0)
  return d.toISOString()
}

const isCorrect = (q: Question, r: Response | undefined) => !!r && r.status === 'submitted' && finalSelection(r) === q.options.find((o) => o.correct)?.id

// ---------- Reintento ----------

export interface RetryGate {
  allowed: boolean
  /** first: nunca lo hiciste · open: hay uno en curso · passed: ya aprobaste · wait: falta que pase el día · review: faltan apartados · ok: puedes reintentar */
  reason: 'first' | 'open' | 'passed' | 'wait' | 'review' | 'ok'
  availableAt?: string
  /**
   * Lecciones de las preguntas falladas en el último intento, con el primer apartado fallado.
   * «done» cuando volviste a responder todas sus comprobaciones después de enviar el examen (R-G-3, T017-01).
   */
  pending: { lessonId: string; anchor: string; done: boolean }[]
}

async function gateFor(db: LearnerDb, courseId: string, exams: Attempt[], at: string): Promise<RetryGate> {
  if (exams.some((a) => a.status === 'in-progress')) return { allowed: true, reason: 'open', pending: [] }
  const submitted = exams.filter((a) => a.status === 'submitted')
  const last = submitted.at(-1)
  if (!last) return { allowed: true, reason: 'first', pending: [] }
  if (submitted.some((a) => a.result?.passed)) return { allowed: false, reason: 'passed', pending: [] }

  const responses = await db.responses.where('attemptId').equals(last.id).toArray()
  const sections = new Map<string, { lessonId: string; anchor: string }>()
  for (const { question } of last.items) {
    if (isCorrect(question, responses.find((r) => r.questionId === question.id))) continue
    const [lessonId, anchor] = question.sectionRef.split('#')
    // Un renglón por lección: el repaso se cuenta al abrirla, y lleva al primer apartado fallado.
    if (!sections.has(lessonId)) sections.set(lessonId, { lessonId, anchor })
  }
  const pending = []
  for (const s of sections.values()) {
    const p = await db.lessonProgress.get(`${courseId}/${s.lessonId}`)
    pending.push({ ...s, done: !!p?.lastCheck && t(p.lastCheck.at) > t(last.submittedAt!) })
  }
  // La fecha se fijó al enviar; los intentos anteriores a esa regla la calculan aquí.
  const availableAt = last.retryAvailableAt ?? nextLocalDay(last.submittedAt!)
  if (pending.some((p) => !p.done)) return { allowed: false, reason: 'review', availableAt, pending }
  if (t(at) < t(availableAt)) return { allowed: false, reason: 'wait', availableAt, pending }
  return { allowed: true, reason: 'ok', availableAt, pending }
}

/** Si se puede reintentar: al día siguiente y después de abrir los apartados de los errores (estándar §4.3, R-G-3). */
export async function retryGate(db: LearnerDb, courseId: string, at = now()): Promise<RetryGate> {
  return gateFor(db, courseId, await examAttempts(db, courseId), at)
}

/**
 * Devuelve el examen en curso o arma uno nuevo. En un reintento, cada familia fallada
 * cambia de variante y se prefieren variantes que no se hayan visto.
 */
export async function startExam(db: LearnerDb, course: ExamCourse, bank: Question[], rng: Rng = Math.random, at = now()): Promise<Attempt> {
  return db.transaction('rw', [db.attempts, db.responses, db.lessonProgress], async () => {
    const previous = await examAttempts(db, course.id)
    const open = previous.find((a) => a.status === 'in-progress')
    if (open) return open
    const gate = await gateFor(db, course.id, previous, at)
    if (gate.reason === 'passed') throw new Error('Ya aprobaste este examen. Lo que sigue es la comprobación de retención.')
    if (gate.reason === 'review') throw new Error('Antes de reintentar, repasa las lecciones de las preguntas que fallaste y vuelve a responder sus comprobaciones.')
    if (gate.reason === 'wait') throw new Error(`El reintento se habilita desde ${new Date(gate.availableAt!).toLocaleString('es')}.`)

    const submitted = previous.filter((a) => a.status === 'submitted')
    const usedVariantsByFamily = await usedVariants(db, course.id, at)
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

/** Variantes vistas hace menos de 30 días en exámenes o retención: todavía no se pueden repetir (R-G-4). */
async function usedVariants(db: LearnerDb, courseId: string, at: string): Promise<Record<string, string[]>> {
  const used: Record<string, string[]> = {}
  const cutoff = t(at) - REPEAT_AFTER_DAYS * DAY_MS
  for (const a of await assessmentAttempts(db, courseId)) {
    if (t(a.startedAt) <= cutoff) continue
    for (const { question } of a.items) {
      if (question.family && question.variant) (used[question.family] ??= []).push(question.variant)
    }
  }
  return used
}

async function failedFamiliesOf(db: LearnerDb, attempt: Attempt): Promise<string[]> {
  const responses = await db.responses.where('attemptId').equals(attempt.id).toArray()
  return attempt.items.filter(({ question }) => !isCorrect(question, responses.find((x) => x.questionId === question.id))).map(({ question }) => question.family!)
}

// ---------- Retención ----------

export interface RetentionStatus {
  /** not-passed: aún no apruebas el examen · locked: faltan días · available: ya puedes hacerla · open: hay una en curso */
  state: 'not-passed' | 'locked' | 'available' | 'open'
  availableAt?: string
  /** La última comprobación enviada, si la hay. */
  last?: Attempt
}

export async function retentionStatus(db: LearnerDb, courseId: string, at = now()): Promise<RetentionStatus> {
  const all = await assessmentAttempts(db, courseId)
  const passed = all.find((a) => a.kind === 'exam' && a.result?.passed)
  if (!passed) return { state: 'not-passed' }
  const checks = all.filter((a) => a.kind === 'retention')
  if (checks.some((a) => a.status === 'in-progress')) return { state: 'open' }
  const last = checks.filter((a) => a.status === 'submitted').at(-1)
  const base = last?.submittedAt ?? passed.submittedAt!
  const availableAt = new Date(new Date(base).getTime() + RETENTION_DAYS * DAY_MS).toISOString()
  return { state: t(at) >= t(availableAt) ? 'available' : 'locked', availableAt, last }
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Arma la comprobación de retención: una variante nunca vista por objetivo. Nunca bloquea nada. */
export async function startRetention(db: LearnerDb, course: ExamCourse, bank: Question[], rng: Rng = Math.random, at = now()): Promise<Attempt> {
  return db.transaction('rw', [db.attempts, db.responses], async () => {
    const all = await assessmentAttempts(db, course.id)
    const open = all.find((a) => a.kind === 'retention' && a.status === 'in-progress')
    if (open) return open
    const status = await retentionStatus(db, course.id, at)
    if (status.state === 'not-passed') throw new Error('La comprobación de retención llega después de aprobar el examen.')
    if (status.state === 'locked') throw new Error(`La comprobación de retención se habilita desde ${new Date(status.availableAt!).toLocaleString('es')}.`)

    const used = await usedVariants(db, course.id, at)
    const usable = bank.filter((q) => q.use === 'exam' && (q.status === 'published' || (course.pilot === true && q.status === 'draft')))
    const items = course.evaluatedObjectiveIds.map((objectiveId) => {
      const unseen = usable.filter((q) => q.evaluatedObjectiveId === objectiveId && !(used[q.family!] ?? []).includes(q.variant!))
      if (unseen.length === 0) throw new Error(`No quedan variantes sin ver para el objetivo ${objectiveId}.`)
      const question = unseen[Math.floor(rng() * unseen.length)]
      const ids = question.options.map((o) => o.id)
      return { question, shownOptionIds: question.fixedOrder ? ids : shuffle(ids, rng) }
    })
    const attempt = Attempt.parse({
      id: newLocalId(),
      kind: 'retention',
      courseId: course.id,
      contentVersion: course.version,
      formLabel: retentionLabel(course),
      isFirstAttempt: !all.some((a) => a.kind === 'retention'),
      startedAt: at,
      status: 'in-progress',
      items: shuffle(items, rng),
    })
    await db.attempts.put(attempt)
    return attempt
  })
}

// ---------- Respuestas y envío ----------

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

/** Confianza opcional en una respuesta ya elegida, antes de ver el resultado (estándar §4.3). */
export async function setExamConfidence(db: LearnerDb, attemptId: string, questionId: string, confidence: Response['confidence'] | undefined): Promise<void> {
  await db.transaction('rw', [db.attempts, db.responses], async () => {
    const attempt = await db.attempts.get(attemptId)
    if (!attempt || attempt.status !== 'in-progress') throw new Error('El examen ya no está abierto')
    const existing = (await db.responses.where('attemptId').equals(attemptId).toArray()).find((r) => r.questionId === questionId)
    if (!existing) throw new Error('Primero elige una respuesta')
    const { confidence: _old, ...rest } = existing
    await db.responses.put(Response.parse(confidence ? { ...rest, confidence } : rest))
  })
}

/** Envía el intento: las respuestas pasan a enviadas y el resultado queda congelado con la regla de su tipo. */
export async function submitExam(db: LearnerDb, attemptId: string, at = now()): Promise<Attempt> {
  return db.transaction('rw', [db.attempts, db.responses], async () => {
    const attempt = await db.attempts.get(attemptId)
    if (!attempt) throw new Error('No existe el intento')
    if (attempt.status !== 'in-progress') return attempt
    const rule = attempt.kind === 'retention' ? RETENTION_RULE : DEFAULT_PASS_RULE
    const responses = await db.responses.where('attemptId').equals(attemptId).toArray()
    const sent = responses.map((r) => Response.parse({ ...r, status: 'submitted', answeredAt: r.answeredAt ?? at }))
    await db.responses.bulkPut(sent)
    const result = scoreAttempt(attempt, sent, rule)
    const next = Attempt.parse({
      ...attempt,
      status: 'submitted',
      submittedAt: at,
      ...(attempt.kind === 'exam' && !result.passed ? { retryAvailableAt: nextLocalDay(at) } : {}),
      result: { correct: result.correct, total: result.total, passed: result.passed, reasons: result.reasons, rule, computedAt: at },
    })
    await db.attempts.put(next)
    return next
  })
}

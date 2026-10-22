/**
 * Contratos de los datos del alumno: viven en IndexedDB, viajan en el respaldo JSON
 * y alimentan el HTML de evaluación (plan §8, §9 y §17).
 *
 * Principio: los intentos guardan una instantánea congelada de cada pregunta mostrada.
 * Un intento antiguo nunca se puntúa con la clave actual (plan §8, "Evaluaciones reproducibles").
 */
import { z } from 'zod'
import { CompetencyId, CourseId, IsoDate, Question, SemVer, Slug } from './content'

export const SCHEMA_VERSION = 1

const Timestamp = z.iso.datetime({ offset: true })
const LocalId = z.string().regex(/^[a-z0-9-]{8,64}$/)

// ---------- Perfil (plan §17.1) ----------

export const Profile = z.object({
  localId: LocalId,
  updatedAt: Timestamp,
  /** Declarado por Daniel. Todo es opcional salvo el ID local. */
  declared: z.object({
    alias: z.string().max(80).optional(),
    professionalContext: z.string().max(2000).optional(),
    goals: z.array(z.string().max(500)).max(20).default([]),
    projects: z.array(z.string().max(300)).max(20).default([]),
    tools: z.array(z.string().max(200)).max(30).default([]),
    preferences: z.string().max(2000).optional(),
    weeklyMinutes: z.int().positive().optional(),
    selfAssessment: z
      .array(z.object({ competencyId: CompetencyId, level: z.enum(['low', 'medium', 'high']), note: z.string().max(500).optional() }))
      .default([]),
    constraints: z.array(z.string().max(300)).max(20).default([]),
  }),
  /**
   * Evidencia previa externa a la app (D-009): ni "declarada" ni "observada en la app".
   * Solo resúmenes de competencias; nada de rutas, código ni datos de proyectos reales.
   */
  priorEvidence: z
    .array(z.object({ source: z.string().max(200), date: IsoDate, summary: z.string().max(2000) }))
    .default([]),
})
export type Profile = z.infer<typeof Profile>

// ---------- Intentos y respuestas (plan §17.2) ----------

export const AttemptKind = z.enum(['diagnostic', 'check', 'practice', 'exam', 'retention'])

/** Pregunta tal como se mostró: definición completa congelada + orden de opciones. */
export const ItemSnapshot = z.object({
  question: Question,
  shownOptionIds: z.array(z.string()).min(3).max(4),
})
export type ItemSnapshot = z.infer<typeof ItemSnapshot>

export const Attempt = z
  .object({
    id: LocalId,
    kind: AttemptKind,
    courseId: CourseId.nullable(),
    contentVersion: SemVer,
    /** Versión del examen o del banco usada, p. ej. "examen M02 v1" (D-012). */
    formLabel: z.string().min(1),
    isFirstAttempt: z.boolean(),
    startedAt: Timestamp,
    submittedAt: Timestamp.optional(),
    status: z.enum(['in-progress', 'submitted', 'abandoned']),
    items: z.array(ItemSnapshot).min(1),
    /**
     * Resultado calculado al enviar, congelado con la regla aplicada (CTR-06).
     * Obligatorio en exámenes y comprobaciones de retención enviados.
     */
    result: z
      .object({
        correct: z.int().min(0),
        total: z.int().min(1),
        passed: z.boolean(),
        reasons: z.array(z.string()),
        rule: z.object({ minCorrect: z.int().min(0), requireEachObjective: z.boolean() }),
        computedAt: Timestamp,
      })
      .optional(),
  })
  .superRefine((a, ctx) => {
    a.items.forEach((it, i) => {
      const optionIds = new Set(it.question.options.map((o) => o.id))
      const shown = new Set(it.shownOptionIds)
      if (shown.size !== optionIds.size || [...shown].some((id) => !optionIds.has(id))) {
        ctx.addIssue({ code: 'custom', path: ['items', i, 'shownOptionIds'], message: 'el orden mostrado debe contener exactamente las opciones de la instantánea' })
      }
    })
    if (a.status === 'submitted' && !a.submittedAt) {
      ctx.addIssue({ code: 'custom', path: ['submittedAt'], message: 'un intento enviado necesita submittedAt' })
    }
    if (a.status === 'submitted' && (a.kind === 'exam' || a.kind === 'retention') && !a.result) {
      ctx.addIssue({ code: 'custom', path: ['result'], message: 'un examen enviado guarda su resultado y la regla aplicada' })
    }
    const ids = a.items.map((it) => it.question.id)
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: 'custom', path: ['items'], message: 'una pregunta aparece dos veces en el intento' })
    }
  })
export type Attempt = z.infer<typeof Attempt>

export const Response = z
  .object({
  id: LocalId,
  attemptId: LocalId,
  questionId: Slug,
  questionVersion: z.int().min(1),
  /** Primera selección: nunca se borra. Las siguientes van en `revisions`. */
  firstSelectedOptionId: z.string().nullable(),
  revisions: z.array(z.object({ selectedOptionId: z.string(), at: Timestamp })).default([]),
  /** "¿Por qué elegiste esta respuesta?" (opcional). */
  explanation: z.string().max(4000).optional(),
  confidence: z.enum(['low', 'medium', 'high']).optional(),
  /** Solo lo declarado por el alumno: la app no puede detectar ayuda externa. */
  declaredHelp: z.enum(['none', 'in-app-hint', 'external-ai', 'other']).optional(),
  feedbackSeenBeforeAnswer: z.boolean(),
  status: z.enum(['draft', 'submitted', 'abandoned']),
  answeredAt: Timestamp.optional(),
  })
  .superRefine((r, ctx) => {
    if (r.status !== 'draft' && !r.answeredAt) {
      ctx.addIssue({ code: 'custom', path: ['answeredAt'], message: 'una respuesta enviada o abandonada necesita fecha' })
    }
  })
export type Response = z.infer<typeof Response>

/** Selección final: la última revisión o, si no hay, la primera. */
export function finalSelection(r: Response): string | null {
  return r.revisions.length > 0 ? r.revisions[r.revisions.length - 1].selectedOptionId : r.firstSelectedOptionId
}

/**
 * Comprueba que las respuestas de un intento correspondan a sus instantáneas (CTR-01):
 * una respuesta por pregunta, misma versión, y toda selección dentro de las opciones mostradas.
 * Devuelve la lista de problemas; vacía si todo cuadra.
 */
export function responseIssues(attempt: Attempt, responses: Response[]): string[] {
  const issues: string[] = []
  const snapshots = new Map(attempt.items.map((it) => [it.question.id, it]))
  const seen = new Set<string>()
  for (const r of responses.filter((x) => x.attemptId === attempt.id)) {
    const snap = snapshots.get(r.questionId)
    if (!snap) {
      issues.push(`la respuesta ${r.id} es de una pregunta que no está en el intento (${r.questionId})`)
      continue
    }
    if (seen.has(r.questionId)) issues.push(`hay más de una respuesta para ${r.questionId}`)
    seen.add(r.questionId)
    if (r.questionVersion !== snap.question.version) {
      issues.push(`${r.questionId}: la respuesta es de la versión ${r.questionVersion} y el intento mostró la ${snap.question.version}`)
    }
    const shown = new Set(snap.shownOptionIds)
    const selections = [r.firstSelectedOptionId, ...r.revisions.map((v) => v.selectedOptionId)].filter((s): s is string => s !== null)
    for (const s of selections) if (!shown.has(s)) issues.push(`${r.questionId}: la opción ${s} no se mostró en el intento`)
  }
  return issues
}

// ---------- Prácticas (content-standard §5) ----------

const CriterionLevel = z.union([z.int().min(1).max(4), z.literal('insufficient-evidence')])

export const PracticeReview = z.object({
  /** Identifica la corrida; dos revisiones con el mismo runId no son independientes (CTR-02). */
  runId: z.string().min(4).max(64),
  reviewer: z.object({
    declaredName: z.string().max(120),
    type: z.enum(['external-assisted', 'human']),
    model: z.string().max(120).optional(),
  }),
  at: Timestamp,
  /** Evidencia citada antes del nivel (R-H-1). */
  criteria: z.array(z.object({ criterionId: Slug, evidenceQuote: z.string().max(2000), level: CriterionLevel })).min(1),
})
export type PracticeReview = z.infer<typeof PracticeReview>

export const PracticeSubmission = z.object({
  id: LocalId,
  practiceId: Slug,
  practiceVersion: SemVer,
  createdAt: Timestamp,
  text: z.string().max(20000),
  evidence: z
    .array(
      z.object({
        kind: z.enum(['text', 'link', 'file-reference']),
        value: z.string().max(4000),
        /** Un enlace o archivo externo queda "pendiente de inspección" en el reporte. */
        includedInReport: z.boolean(),
      }),
    )
    .default([]),
  notebook: z
    .object({
      initialDecision: z.string().max(4000),
      counterexample: z.string().max(4000),
      revisedDecision: z.string().max(4000),
      evidenceForChange: z.string().max(4000),
    })
    .optional(),
  selfAssessment: z.array(z.object({ criterionId: Slug, level: CriterionLevel, evidence: z.string().max(2000) })).default([]),
  reviews: z.array(PracticeReview).default([]),
  state: z.enum(['presented', 'self-assessed', 'review-pending', 'reviewed']),
})
export type PracticeSubmission = z.infer<typeof PracticeSubmission>

/** Lo que el estado necesita saber de la práctica, en la versión que se entregó. */
export interface PracticeRequirements {
  criterionIds: string[]
  transferNotebook: boolean
}

function coversExactly(criteria: { criterionId: string }[], required: string[]): boolean {
  const ids = criteria.map((c) => c.criterionId)
  return new Set(ids).size === ids.length && ids.length === required.length && required.every((id) => ids.includes(id))
}

/**
 * Estado de una práctica (content-standard §5 y §5.1):
 * - presentada: falta el cuaderno (si la práctica lo exige) o la autoevaluación de todos los criterios;
 * - autoevaluada: completa, sin revisiones externas;
 * - revisión pendiente: menos de dos revisiones independientes válidas, o discrepan;
 * - revisada: las dos últimas revisiones, de corridas distintas, evalúan exactamente los criterios
 *   de la rúbrica y no discrepan más de un nivel en ninguno (R-H-8 [H]).
 */
export function reviewState(
  sub: Pick<PracticeSubmission, 'selfAssessment' | 'reviews' | 'notebook'>,
  practice: PracticeRequirements,
): PracticeSubmission['state'] {
  if (practice.transferNotebook && !sub.notebook) return 'presented'
  if (!coversExactly(sub.selfAssessment, practice.criterionIds)) return 'presented'
  if (sub.reviews.length === 0) return 'self-assessed'
  const valid = sub.reviews.filter((r) => coversExactly(r.criteria, practice.criterionIds))
  if (valid.length < 2) return 'review-pending'
  const [a, b] = valid.slice(-2)
  if (a.runId === b.runId) return 'review-pending'
  for (const ca of a.criteria) {
    const cb = b.criteria.find((c) => c.criterionId === ca.criterionId)!
    if (ca.level === 'insufficient-evidence' || cb.level === 'insufficient-evidence') {
      if (ca.level !== cb.level) return 'review-pending'
      continue
    }
    if (Math.abs(ca.level - (cb.level as number)) > 1) return 'review-pending'
  }
  return 'reviewed'
}

// ---------- Feedback externo y ruta personal (plan §17.6–17.7) ----------

export const ExternalFeedback = z.object({
  id: LocalId,
  sourceReportId: LocalId,
  reviewer: z.object({ declaredName: z.string().max(120), reviewType: z.enum(['external-assisted', 'human']) }),
  receivedAt: Timestamp,
  fullText: z.string().max(100000),
  /** Hash del texto para que registrar el mismo feedback dos veces no duplique acciones. */
  textHash: z.string().min(8),
})
export type ExternalFeedback = z.infer<typeof ExternalFeedback>

export const PlanAdjustment = z.object({
  id: LocalId,
  origin: z.enum(['manual', 'recommendation']),
  feedbackId: LocalId.optional(),
  targetIds: z.array(z.string().max(64)).default([]),
  kind: z.enum(['reorder', 'review-lesson', 'extra-exercise', 'new-topic', 'note']),
  change: z.string().max(4000),
  reason: z.string().max(2000),
  successCriterion: z.string().max(2000).optional(),
  createdAt: Timestamp,
  state: z.enum(['proposed', 'accepted', 'in-progress', 'done', 'postponed', 'discarded']),
  history: z.array(z.object({ state: z.string(), at: Timestamp })).default([]),
})
export type PlanAdjustment = z.infer<typeof PlanAdjustment>

// ---------- Progreso de lectura ----------

/** Progreso por lección: lo observado en la app, no lo declarado. */
export const LessonProgress = z.object({
  /** `<curso>/<lección>` */
  key: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
  courseId: CourseId,
  lessonId: Slug,
  firstVisitedAt: Timestamp,
  lastVisitedAt: Timestamp,
  /** Primera vez que se respondieron todas las comprobaciones de la lección. */
  checksCompletedAt: Timestamp.optional(),
  /** Resultado de la última ronda completa de comprobaciones. */
  lastCheck: z.object({ correct: z.int().min(0), total: z.int().min(1), at: Timestamp }).optional(),
})
export type LessonProgress = z.infer<typeof LessonProgress>

// ---------- Respaldo completo (plan §9) ----------

export const Backup = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  exportedAt: Timestamp,
  appVersion: SemVer,
  contentVersions: z.record(z.string(), SemVer),
  profile: Profile,
  attempts: z.array(Attempt),
  responses: z.array(Response),
  practiceSubmissions: z.array(PracticeSubmission),
  feedback: z.array(ExternalFeedback),
  adjustments: z.array(PlanAdjustment),
  notes: z.array(z.object({ id: LocalId, targetId: z.string().max(64), text: z.string().max(10000), updatedAt: Timestamp })),
  bookmarks: z.array(z.object({ id: LocalId, targetId: z.string().max(64), createdAt: Timestamp })),
  lessonProgress: z.array(LessonProgress).default([]),
})
export type Backup = z.infer<typeof Backup>

/**
 * Contratos del contenido publicado (cursos, lecciones, preguntas, prácticas, fuentes,
 * fichas de producto y activos). Se validan en build; nada de esto lo edita el alumno.
 *
 * Reglas de origen: docs/content-standard.md y docs/decisions.md (D-007, D-015 a D-017).
 */
import { z } from 'zod'

// ---------- Identificadores ----------

export const CourseId = z.string().regex(/^m(0[1-9]|10)$/, 'curso: m01…m10')
export const CompetencyId = z.string().regex(/^C(0[1-9]|1[0-3])$/, 'competencia: C01…C13')
export const BlockId = z.enum(['B1', 'B2', 'B3', 'B4', 'B5', 'B6'])
export const SourceId = z.string().regex(/^src-[a-z0-9-]+$/, 'fuente: src-<org>-<slug>')
/** IDs internos en kebab-case: m02-l3, m02-eo1, m02-f04-b, m02-mc07… */
export const Slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id en kebab-case')
export const SemVer = z.string().regex(/^\d+\.\d+\.\d+$/, 'versión semántica x.y.z')
export const IsoDate = z.iso.date()

/** Proceso de la taxonomía de Bloom revisada (R-B-2). */
export const BloomProcess = z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'])
export const Volatility = z.enum(['low', 'medium', 'high', 'very-high'])
export const PublicationStatus = z.enum(['draft', 'in-review', 'published', 'retired'])

// ---------- Competencias ----------

export const Competency = z.object({
  id: CompetencyId,
  name: z.string().min(3),
  definition: z.string().min(10),
  /** Conductas observables medibles con escenarios (curriculum.md §2). */
  behaviors: z.array(z.string().min(10)).min(2).max(3),
  primaryCourse: CourseId,
  supportCourses: z.array(CourseId),
  /** Bloque del diagnóstico; null para C13, que no se diagnostica (D-015). */
  diagnosticBlock: BlockId.nullable(),
})
export type Competency = z.infer<typeof Competency>

// ---------- Curso y blueprint ----------

/** Objetivo evaluado del manual: unidad de cobertura del banco y el examen (D-017). */
export const EvaluatedObjective = z.object({
  id: Slug,
  statement: z.string().min(20),
  competencyIds: z.array(CompetencyId).min(1),
})

export const Course = z
  .object({
    id: CourseId,
    version: SemVer,
    title: z.string().min(3),
    centralQuestion: z.string().endsWith('?'),
    competencyIds: z.array(CompetencyId).min(1),
    evaluatedObjectives: z.array(EvaluatedObjective).min(1).max(6),
    lessonIds: z.array(Slug).min(5).max(6),
    practiceId: Slug,
    estimatedMinutes: z.int().positive(),
    volatility: Volatility,
    reviewCadence: z.enum(['quarterly', 'semiannual', 'annual']),
    status: PublicationStatus,
  })
  .superRefine((c, ctx) => {
    const ids = c.evaluatedObjectives.map((o) => o.id)
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: 'custom', path: ['evaluatedObjectives'], message: 'IDs de objetivo evaluado repetidos' })
    }
  })
export type Course = z.infer<typeof Course>

// ---------- Lección ----------

export const LessonObjective = z.object({
  id: Slug,
  /** "Dado…, [verbo observable]… [criterio]" (R-B-1). */
  statement: z.string().min(20),
  process: BloomProcess,
  /** Vínculo obligatorio con el blueprint del manual (content-standard §3.3). */
  evaluatedObjectiveId: Slug,
})

export const Lesson = z.object({
  id: Slug,
  courseId: CourseId,
  version: SemVer,
  order: z.int().min(1).max(6),
  title: z.string().min(3),
  objectives: z.array(LessonObjective).min(1).max(3),
  /** Markdown de la lección, relativo a content/. */
  bodyPath: z.string().endsWith('.md'),
  /** 2–3 preguntas de repaso desde la segunda lección (R-A2-1). */
  reviewQuestionIds: z.array(Slug).max(3),
  /** Comprobación final: 3–5 preguntas (R-A1-1). */
  checkQuestionIds: z.array(Slug).min(3).max(5),
  assetIds: z.array(Slug),
  sourceIds: z.array(SourceId),
  productCardIds: z.array(Slug),
  /** Hipótesis [H]: 25 minutos o menos (content-standard §9). */
  estimatedMinutes: z.int().positive().max(25),
  status: PublicationStatus,
})
export type Lesson = z.infer<typeof Lesson>

// ---------- Conceptos erróneos ----------

export const Misconception = z.object({
  id: Slug,
  courseId: CourseId.nullable(),
  description: z.string().min(10),
  whyWrong: z.string().min(10),
  /** Toda afirmación del catálogo es trazable (DX-01). */
  sourceIds: z.array(SourceId).min(1),
})
export type Misconception = z.infer<typeof Misconception>

// ---------- Pregunta (ítem versionado) ----------

export const QuestionUse = z.enum(['check', 'practice', 'exam', 'diagnostic'])

export const QuestionOption = z.object({
  /** Estable entre versiones y reordenamientos; la respuesta se guarda por este ID. */
  id: z.string().regex(/^[a-z0-9]{2,12}$/),
  text: z.string().min(1),
  correct: z.boolean(),
  /** Obligatorio en distractores; prohibido el de relleno (R-C2-2). */
  misconceptionId: Slug.optional(),
  /** 2–4 frases [H], centradas en la tarea (R-D-2 a R-D-4). */
  feedback: z.string().min(20),
})

export const Question = z
  .object({
    /** ID estable del ítem; cada cambio publicado sube `version` (R-05). */
    id: Slug,
    version: z.int().min(1),
    use: QuestionUse,
    courseId: CourseId.nullable(),
    lessonId: Slug.optional(),
    evaluatedObjectiveId: Slug.optional(),
    competencyIds: z.array(CompetencyId).min(1),
    diagnosticBlock: BlockId.optional(),
    difficulty: z.enum(['base', 'advanced']),
    process: BloomProcess,
    /** Familia y variante: obligatorias en el banco de examen (D-016, D-017). */
    family: Slug.optional(),
    variant: z.string().regex(/^[a-z]$/).optional(),
    scenario: z.string().min(1),
    stem: z.string().min(10),
    options: z.array(QuestionOption).min(3).max(4),
    /** Opciones numéricas u ordinales no se barajan (R-C1-6). */
    fixedOrder: z.boolean().default(false),
    /** Apartado que justifica la respuesta (plan §11). */
    sectionRef: z.string().min(1),
    /** La clave y el feedback se apoyan en al menos una fuente registrada (DX-01). */
    sourceIds: z.array(SourceId).min(1),
    status: PublicationStatus,
    publishedAt: IsoDate.optional(),
    replacedBy: z.object({ id: Slug, version: z.int().min(1) }).optional(),
  })
  .superRefine((q, ctx) => {
    const correct = q.options.filter((o) => o.correct)
    if (correct.length !== 1) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: `debe haber exactamente una opción correcta (hay ${correct.length})` })
    }
    const ids = q.options.map((o) => o.id)
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: 'IDs de opción repetidos' })
    }
    q.options.forEach((o, i) => {
      if (!o.correct && !o.misconceptionId) {
        ctx.addIssue({ code: 'custom', path: ['options', i, 'misconceptionId'], message: 'cada distractor necesita un misconceptionId' })
      }
    })
    const words = q.stem.trim().split(/\s+/).length + q.scenario.trim().split(/\s+/).length
    if (words > 120) {
      ctx.addIssue({ code: 'custom', path: ['stem'], message: `escenario + enunciado tienen ${words} palabras; el límite [H] es 120` })
    }
    if (q.use === 'exam') {
      for (const key of ['courseId', 'evaluatedObjectiveId', 'family', 'variant'] as const) {
        if (!q[key]) ctx.addIssue({ code: 'custom', path: [key], message: `obligatorio en ítems de examen` })
      }
    }
    if (q.use === 'diagnostic' && !q.diagnosticBlock) {
      ctx.addIssue({ code: 'custom', path: ['diagnosticBlock'], message: 'obligatorio en ítems de diagnóstico' })
    }
    if (q.status === 'retired' && !q.replacedBy && !q.publishedAt) {
      ctx.addIssue({ code: 'custom', path: ['status'], message: 'un ítem retirado debe haberse publicado antes' })
    }
  })
export type Question = z.infer<typeof Question>

// ---------- Práctica / laboratorio ----------

export const RubricCriterion = z.object({
  id: Slug,
  name: z.string().min(3),
  /** Los críticos no se compensan con otros criterios (R-F-3). */
  critical: z.boolean(),
  levels: z
    .array(z.object({ level: z.int().min(1).max(4), descriptor: z.string().min(10) }))
    .min(3)
    .max(4),
})

export const Practice = z.object({
  id: Slug,
  courseId: CourseId,
  version: SemVer,
  title: z.string().min(3),
  evaluatedObjectiveIds: z.array(Slug).min(1),
  inputs: z.array(z.string().min(3)).min(1),
  instructionsPath: z.string().endsWith('.md'),
  deliverable: z.string().min(10),
  evidenceRequired: z.array(z.string().min(3)).min(1),
  rubric: z.array(RubricCriterion).min(3).max(5),
  anchors: z.object({ achieved: z.string().min(10), insufficient: z.string().min(10) }),
  /** Check que el alumno ejecuta en su entorno; la app no finge ejecutarlo. */
  executableCheck: z.object({ description: z.string().min(10), command: z.string().optional() }).optional(),
  /** Cuaderno de decisiones de transferencia (D-012). */
  transferNotebook: z.boolean(),
  status: PublicationStatus,
})
export type Practice = z.infer<typeof Practice>

// ---------- Diagnóstico (D-015) ----------

/** Microtarea del diagnóstico: muestra producción, no solo reconocimiento. */
export const Microtask = z.object({
  id: Slug,
  version: z.int().min(1),
  diagnosticBlock: BlockId,
  competencyIds: z.array(CompetencyId).min(1),
  title: z.string().min(3),
  /** Material que recibe el alumno (Markdown; puede incluir un diff). */
  material: z.string().min(20),
  /** Pregunta rápida antes de la tarea completa: "¿qué revisarías primero y por qué?". */
  firstQuestion: z.string().endsWith('?'),
  task: z.string().min(20),
  estimatedMinutes: z.int().positive().max(15),
  rubric: z.array(RubricCriterion).min(3).max(4),
  anchors: z.object({ achieved: z.string().min(10), insufficient: z.string().min(10) }),
})
export type Microtask = z.infer<typeof Microtask>

export const DiagnosticForm = z.object({
  id: Slug,
  version: SemVer,
  /** Se declara en la pantalla de inicio y en el reporte (pedagogia-evaluacion §4.1). */
  purpose: z.string().min(20),
  itemIds: z.array(Slug).length(24),
  microtaskIds: z.array(Slug).length(2),
  blocks: z
    .array(z.object({ id: BlockId, name: z.string().min(3), competencyIds: z.array(CompetencyId).min(1) }))
    .length(6),
})
export type DiagnosticForm = z.infer<typeof DiagnosticForm>

// ---------- Fuentes y fichas de producto ----------

export const Source = z.object({
  id: SourceId,
  title: z.string().min(3),
  organization: z.string().min(2),
  url: z.url(),
  accessedAt: IsoDate,
  supports: z.array(z.string().min(5)).min(1),
  kind: z.enum(['primary', 'secondary']),
  volatility: Volatility,
  nextReview: IsoDate,
})
export type Source = z.infer<typeof Source>

export const ProductCard = z.object({
  id: Slug,
  product: z.string().min(2),
  surface: z.enum(['chat', 'api', 'cli', 'ide', 'desktop', 'web', 'cloud', 'mobile']),
  capability: z.string().min(5),
  maturity: z.enum(['ga', 'beta', 'preview', 'deprecated']),
  verifiedAt: IsoDate,
  sourceIds: z.array(SourceId).min(1),
  nextReview: IsoDate,
})
export type ProductCard = z.infer<typeof ProductCard>

/** Una ficha vencida se muestra como "pendiente de verificar" (content-standard §7.2). */
export function isProductCardStale(card: ProductCard, today: string): boolean {
  return card.nextReview < today
}

// ---------- Activos visuales ----------

export const Asset = z.object({
  id: Slug,
  courseId: CourseId.nullable(),
  file: z.string().min(3),
  function: z.enum(['orientation', 'represent', 'organize', 'explain']),
  pedagogicalQuestion: z.string().min(5),
  whyNotTextOrSvg: z.string().min(5),
  alt: z.string().min(10),
  generation: z
    .object({
      prompt: z.string().min(10),
      tool: z.string().min(2),
      /** Lo que expone la herramienta; "no expuesto" es válido (PROTOCOLO §6). */
      modelReported: z.string().min(2),
      modelDocumented: z.string().optional(),
      generatedAt: IsoDate,
      selectedVariant: z.string().min(1),
    })
    .optional(),
  dimensions: z.object({ width: z.int().positive(), height: z.int().positive() }),
  reviewStatus: z.enum(['pending', 'approved', 'changes-requested']),
})
export type Asset = z.infer<typeof Asset>

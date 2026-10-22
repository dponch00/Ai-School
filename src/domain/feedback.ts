/**
 * Retroalimentación estructurada que un evaluador puede devolver (plan §17.6). Es opcional:
 * el ciclo funciona igual pegando solo el texto. Si el bloque no es válido, el texto se conserva
 * y no se aplica nada.
 */
import { z } from 'zod'
import { CompetencyId } from './content'
import type { PlanAdjustment } from './learner'

export const FeedbackImport = z.object({
  schema_version: z.literal(1),
  source_report_id: z.string().max(64),
  reviewer: z.object({
    declared_name: z.string().min(1).max(120),
    review_type: z.enum(['external_assisted', 'human']),
  }),
  summary: z.string().max(20000),
  observations: z
    .array(
      z.object({
        competency_id: CompetencyId,
        evidence_ids: z.array(z.string().max(160)).max(50).default([]),
        finding: z.string().min(1).max(4000),
        uncertainty: z.string().max(2000).optional(),
      }),
    )
    .max(50)
    .default([]),
  recommendations: z
    .array(
      z.object({
        type: z.enum(['review', 'reorder', 'extra_exercise', 'new_topic', 'note']),
        priority: z.enum(['high', 'medium', 'low']).optional(),
        target_ids: z.array(z.string().max(64)).max(20).default([]),
        action: z.string().min(1).max(4000),
        success_criterion: z.string().max(2000).optional(),
      }),
    )
    .max(30)
    .default([]),
})
export type FeedbackImport = z.infer<typeof FeedbackImport>

export const RECOMMENDATION_KIND: Record<FeedbackImport['recommendations'][number]['type'], PlanAdjustment['kind']> = {
  review: 'review-lesson',
  reorder: 'reorder',
  extra_exercise: 'extra-exercise',
  new_topic: 'new-topic',
  note: 'note',
}

/** Plantilla para pedir al evaluador el bloque estructurado (no es un archivo listo para importar). */
export function feedbackTemplate(reportId: string): string {
  return JSON.stringify(
    {
      schema_version: 1,
      source_report_id: reportId,
      reviewer: { declared_name: '<quién evalúa>', review_type: 'external_assisted' },
      summary: '<evaluación breve>',
      observations: [{ competency_id: 'C02', evidence_ids: ['<ID de pregunta o práctica del reporte>'], finding: '<hallazgo>', uncertainty: '<limitación>' }],
      recommendations: [{ type: 'review', priority: 'high', target_ids: ['<ID de lección o competencia>'], action: '<acción propuesta>', success_criterion: '<evidencia esperada>' }],
    },
    null,
    2,
  )
}

export type ParsedFeedback =
  | { kind: 'text' }
  | { kind: 'structured'; data: FeedbackImport }
  | { kind: 'invalid'; reason: string }

/**
 * Busca un bloque JSON con `schema_version` dentro del texto pegado (puede venir entre ```).
 * Nunca ejecuta nada: solo intenta leerlo y validarlo.
 */
export function parseFeedback(text: string): ParsedFeedback {
  const fenced = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1])
  const candidates = [...fenced, text].map((s) => s.trim()).filter((s) => s.startsWith('{') && s.includes('schema_version'))
  if (candidates.length === 0) return { kind: 'text' }
  let lastError = ''
  for (const c of candidates) {
    let raw: unknown
    try {
      raw = JSON.parse(c)
    } catch {
      lastError = 'el bloque JSON no se puede leer'
      continue
    }
    const r = FeedbackImport.safeParse(raw)
    if (r.success) return { kind: 'structured', data: r.data }
    const i = r.error.issues[0]
    lastError = `${i.path.join('.') || 'raíz'}: ${i.message}`
  }
  return { kind: 'invalid', reason: lastError }
}

/** Referencias que no existen en la app: se muestran antes de registrar, no se corrigen solas. */
export function feedbackDiscrepancies(
  data: FeedbackImport,
  known: { reportIds: Set<string>; targetIds: Set<string>; competencyIds: Set<string> },
  selectedReportId: string,
): string[] {
  const out: string[] = []
  if (!known.reportIds.has(data.source_report_id)) out.push(`El reporte de origen «${data.source_report_id}» no existe en esta app.`)
  else if (data.source_report_id !== selectedReportId) out.push(`El bloque dice que evalúa el reporte «${data.source_report_id}», pero elegiste otro.`)
  for (const o of data.observations) if (!known.competencyIds.has(o.competency_id)) out.push(`Competencia desconocida: ${o.competency_id}.`)
  for (const r of data.recommendations) {
    for (const t of r.target_ids) if (!known.targetIds.has(t)) out.push(`La recomendación «${r.action.slice(0, 60)}» apunta a «${t}», que no es una lección, curso ni competencia conocida.`)
  }
  return out
}

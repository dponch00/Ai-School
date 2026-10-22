/**
 * Retroalimentación externa y ruta personal (plan §17.6–17.7, F1-11).
 * Registrar feedback nunca toca respuestas ni puntuaciones; aplicar una recomendación es una acción explícita.
 */
import { RECOMMENDATION_KIND, feedbackDiscrepancies, type FeedbackImport } from '../domain/feedback'
import { ExternalFeedback, PlanAdjustment } from '../domain/learner'
import type { LearnerDb } from './db'
import { newLocalId, now } from './progress'

/**
 * Huella de una retroalimentación: el mismo texto del mismo evaluador sobre el mismo reporte no se duplica
 * (§17.6, idempotente). El mismo texto sobre otro reporte, o de otro evaluador, es otra relación (T015-R02).
 */
export async function feedbackHash(text: string, sourceReportId: string, reviewer: ExternalFeedback['reviewer']): Promise<string> {
  const key = [sourceReportId, reviewer.reviewType, reviewer.declaredName.trim().toLowerCase(), text.replace(/\r\n/g, '\n').trim()].join('\n')
  const bytes = new TextEncoder().encode(key)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export interface FeedbackInput {
  sourceReportId: string
  reviewer: ExternalFeedback['reviewer']
  fullText: string
  receivedAt?: string
  /** Bloque estructurado ya validado; sus recomendaciones entran como propuestas. */
  structured?: FeedbackImport
}

/** Lo que existe en la app, para volver a comprobar las referencias justo antes de escribir (T015-R01). */
export interface KnownRefs {
  reportIds: Set<string>
  targetIds: Set<string>
  competencyIds: Set<string>
}

export async function registerFeedback(db: LearnerDb, input: FeedbackInput, known: KnownRefs): Promise<{ feedback: ExternalFeedback; created: boolean; proposals: number }> {
  if (!known.reportIds.has(input.sourceReportId)) throw new Error('El reporte elegido no existe en esta app.')
  if (input.structured) {
    const problems = feedbackDiscrepancies(input.structured, known, input.sourceReportId)
    if (problems.length > 0) throw new Error(`El bloque de recomendaciones tiene referencias que no cuadran: ${problems.join(' ')}`)
  }
  const hash = await feedbackHash(input.fullText, input.sourceReportId, input.reviewer)
  return db.transaction('rw', [db.feedback, db.adjustments], async () => {
    const existing = await db.feedback.where('textHash').equals(hash).first()
    if (existing) return { feedback: existing, created: false, proposals: 0 }
    const at = input.receivedAt ?? now()
    const feedback = ExternalFeedback.parse({ id: newLocalId(), sourceReportId: input.sourceReportId, reviewer: input.reviewer, receivedAt: at, fullText: input.fullText, textHash: hash })
    await db.feedback.put(feedback)
    const recs = input.structured?.recommendations ?? []
    for (const r of recs) {
      await db.adjustments.put(
        PlanAdjustment.parse({
          id: newLocalId(),
          origin: 'recommendation',
          feedbackId: feedback.id,
          targetIds: r.target_ids,
          kind: RECOMMENDATION_KIND[r.type],
          change: r.action,
          reason: `Recomendación de ${input.reviewer.declaredName}${r.priority ? ` (prioridad ${r.priority === 'high' ? 'alta' : r.priority === 'medium' ? 'media' : 'baja'})` : ''}`,
          successCriterion: r.success_criterion,
          createdAt: at,
          state: 'proposed',
          history: [{ state: 'proposed', at }],
        }),
      )
    }
    return { feedback, created: true, proposals: recs.length }
  })
}

export type AdjustmentDraft = Pick<PlanAdjustment, 'kind' | 'targetIds' | 'change' | 'reason' | 'successCriterion'>

/** Un ajuste manual de Daniel: un repaso, un ejercicio, un tema nuevo o una nota. No toca el currículo oficial. */
export async function addAdjustment(db: LearnerDb, draft: AdjustmentDraft, state: PlanAdjustment['state'] = 'accepted', at = now()): Promise<PlanAdjustment> {
  const adj = PlanAdjustment.parse({ id: newLocalId(), origin: 'manual', ...draft, createdAt: at, state, history: [{ state, at }] })
  await db.adjustments.put(adj)
  return adj
}

/** Cambia el estado y lo deja en el historial; nada se borra. */
export async function setAdjustmentState(db: LearnerDb, id: string, state: PlanAdjustment['state'], at = now()): Promise<PlanAdjustment> {
  return db.transaction('rw', db.adjustments, async () => {
    const a = await db.adjustments.get(id)
    if (!a) throw new Error('No existe el ajuste')
    if (a.state === state) return a
    const next = PlanAdjustment.parse({ ...a, state, history: [...a.history, { state, at }] })
    await db.adjustments.put(next)
    return next
  })
}

/** Deshace el último cambio de estado (§17.7: «permitir revertir»). */
export async function revertAdjustment(db: LearnerDb, id: string, at = now()): Promise<PlanAdjustment> {
  const a = await db.adjustments.get(id)
  if (!a) throw new Error('No existe el ajuste')
  const previous = a.history.length >= 2 ? a.history[a.history.length - 2].state : null
  if (!previous) return a
  return setAdjustmentState(db, id, previous as PlanAdjustment['state'], at)
}

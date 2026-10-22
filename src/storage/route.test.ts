// Retroalimentación externa y ruta personal (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { feedbackDiscrepancies, feedbackTemplate, parseFeedback } from '../domain/feedback'
import { makeQuestion } from '../domain/fixtures.test-utils'
import { openDb, type LearnerDb } from './db'
import { recordCheckAnswer } from './progress'
import { addAdjustment, registerFeedback, revertAdjustment, setAdjustmentState } from './route'

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-route-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

const reviewer = { declaredName: 'Evaluador de prueba', reviewType: 'external-assisted' as const }
const structured = (reportId: string, targets = ['m02-l2']) => `Mi evaluación en texto.

\`\`\`json
${JSON.stringify({
  schema_version: 1,
  source_report_id: reportId,
  reviewer: { declared_name: 'Evaluador de prueba', review_type: 'external_assisted' },
  summary: 'Bien en objetivos, flojo en supuestos.',
  observations: [{ competency_id: 'C02', evidence_ids: ['m02-l2-c1'], finding: 'Confunde decidir con preguntar', uncertainty: 'Solo 4 respuestas' }],
  recommendations: [{ type: 'review', priority: 'high', target_ids: targets, action: 'Repasar la política de ambigüedad', success_criterion: '3 de 3 en las comprobaciones de L2' }],
})}
\`\`\``

describe('lectura de la retroalimentación', () => {
  it('distingue texto solo, bloque válido y bloque inválido (que se conserva como texto)', () => {
    expect(parseFeedback('Buen trabajo, repasa L2.').kind).toBe('text')
    const ok = parseFeedback(structured('rep-000000000001'))
    expect(ok.kind).toBe('structured')
    const bad = parseFeedback('```json\n{"schema_version": 1, "reviewer": {}}\n```')
    expect(bad.kind).toBe('invalid')
  })

  it('la plantilla que se le da al evaluador es un bloque válido una vez rellenado', () => {
    const filled = feedbackTemplate('rep-000000000001').replace(/<[^>]+>/g, 'x')
    expect(parseFeedback(filled).kind).toBe('structured')
  })

  it('señala referencias que no existen antes de registrar', () => {
    const p = parseFeedback(structured('rep-desconocido', ['m02-l9']))
    if (p.kind !== 'structured') throw new Error('debía ser válido')
    const d = feedbackDiscrepancies(p.data, { reportIds: new Set(['rep-000000000001']), targetIds: new Set(['m02-l2']), competencyIds: new Set(['C02']) }, 'rep-000000000001')
    expect(d.join(' ')).toContain('rep-desconocido')
    expect(d.join(' ')).toContain('m02-l9')
  })
})

describe('registro y ruta', () => {
  it('registrar crea el feedback y una propuesta por recomendación, sin tocar respuestas', async () => {
    await recordCheckAnswer(db, { courseId: 'm02', lessonId: 'm02-l1', purpose: 'checks', contentVersion: '0.1.0', size: 1 }, null, makeQuestion({ id: 'm02-l1-c1', use: 'check' }), ['k1', 'd1', 'd2'], 'd1')
    const before = JSON.stringify(await db.responses.toArray())
    const text = structured('rep-000000000001')
    const p = parseFeedback(text)
    const r = await registerFeedback(db, { sourceReportId: 'rep-000000000001', reviewer, fullText: text, structured: p.kind === 'structured' ? p.data : undefined })
    expect(r).toMatchObject({ created: true, proposals: 1 })
    const [adj] = await db.adjustments.toArray()
    expect(adj).toMatchObject({ origin: 'recommendation', state: 'proposed', kind: 'review-lesson', targetIds: ['m02-l2'], feedbackId: r.feedback.id })
    expect(JSON.stringify(await db.responses.toArray())).toBe(before)
  })

  it('registrar dos veces el mismo texto no duplica feedback ni propuestas', async () => {
    const text = structured('rep-000000000001')
    const p = parseFeedback(text)
    const data = p.kind === 'structured' ? p.data : undefined
    await registerFeedback(db, { sourceReportId: 'rep-000000000001', reviewer, fullText: text, structured: data })
    const again = await registerFeedback(db, { sourceReportId: 'rep-000000000001', reviewer, fullText: text + '\n', structured: data })
    expect(again.created).toBe(false)
    expect(await db.feedback.count()).toBe(1)
    expect(await db.adjustments.count()).toBe(1)
  })

  it('un ajuste manual se acepta, avanza y se puede revertir; el historial se conserva', async () => {
    const a = await addAdjustment(db, { kind: 'new-topic', targetIds: [], change: 'Tema nuevo: evaluar prompts con casos fijos', reason: 'Me interesa para mi trabajo' })
    expect(a.state).toBe('accepted')
    await setAdjustmentState(db, a.id, 'in-progress')
    const done = await setAdjustmentState(db, a.id, 'done')
    expect(done.history.map((h) => h.state)).toEqual(['accepted', 'in-progress', 'done'])
    const back = await revertAdjustment(db, a.id)
    expect(back.state).toBe('in-progress')
    expect(back.history).toHaveLength(4)
  })
})

// Repaso de errores con confianza alta (R-E-4, R-E-5).
import { describe, expect, it } from 'vitest'
import { makeAttempt, makeQuestion } from './fixtures.test-utils'
import type { Attempt, Response } from './learner'
import { errorReviewLabel, errorReviewQueue } from './review-queue'

const q = makeQuestion({ id: 'm02-l2-c1', use: 'check' })
const T0 = '2026-10-20T15:00:00.000Z'
const plus = (h: number) => new Date(Date.parse(T0) + h * 3_600_000).toISOString()

let n = 0
function answered(kind: Attempt['kind'], formLabel: string, at: string, option: string, confidence?: Response['confidence']) {
  const a = makeAttempt([q], { id: `attempt-${++n}-xyz`, kind, formLabel, result: undefined, startedAt: at, submittedAt: at })
  const r: Response = { id: `resp-${n}-xyzw`, attemptId: a.id, questionId: q.id, questionVersion: 1, firstSelectedOptionId: option, revisions: [], feedbackSeenBeforeAnswer: false, status: 'submitted', answeredAt: at, ...(confidence ? { confidence } : {}) }
  return { a, r }
}
const queue = (items: { a: Attempt; r: Response }[], atH: number) =>
  errorReviewQueue(items.map((x) => x.a), items.map((x) => x.r), 'm02', plus(atH))

describe('repaso de errores con confianza alta', () => {
  it('un error con confianza alta vuelve al día siguiente, no antes', () => {
    const src = answered('check', 'comprobaciones m02-l2', T0, 'd1', 'high')
    expect(queue([src], 12).due).toHaveLength(0)
    expect(queue([src], 12).upcoming).toHaveLength(1)
    expect(queue([src], 25).due.map((x) => x.questionId)).toEqual(['m02-l2-c1'])
  })

  it('un error sin confianza alta, o un acierto con confianza alta, no entra', () => {
    expect(queue([answered('check', 'comprobaciones m02-l2', T0, 'd1', 'medium')], 48).due).toHaveLength(0)
    expect(queue([answered('check', 'comprobaciones m02-l2', T0, 'k1', 'high')], 48).due).toHaveLength(0)
  })

  it('un acierto en el repaso lo pospone 7 días; el segundo acierto lo saca de la cola', () => {
    const src = answered('exam', 'examen m02 v0.1.0', T0, 'd1', 'high')
    const r1 = answered('check', errorReviewLabel('m02'), plus(25), 'k1')
    const afterFirst = queue([src, r1], 26)
    expect(afterFirst.due).toHaveLength(0)
    expect(afterFirst.upcoming[0].streak).toBe(1)
    expect(queue([src, r1], 25 + 24 * 7 + 1).due).toHaveLength(1)
    const r2 = answered('check', errorReviewLabel('m02'), plus(25 + 24 * 7 + 2), 'k1')
    expect(queue([src, r1, r2], 24 * 30)).toMatchObject({ due: [], upcoming: [], resolved: 1 })
  })

  it('un error en el repaso lo devuelve al día siguiente y reinicia la racha', () => {
    const src = answered('check', 'comprobaciones m02-l2', T0, 'd1', 'high')
    const r1 = answered('check', errorReviewLabel('m02'), plus(25), 'k1')
    const r2 = answered('check', errorReviewLabel('m02'), plus(25 + 24 * 7 + 1), 'd2')
    const qq = queue([src, r1, r2], 25 + 24 * 7 + 2)
    expect(qq.upcoming[0]).toMatchObject({ streak: 0 })
    expect(queue([src, r1, r2], 25 + 24 * 8 + 2).due).toHaveLength(1)
  })

  it('las respuestas de otro curso no entran', () => {
    const src = answered('check', 'comprobaciones m03-l1', T0, 'd1', 'high')
    src.a.courseId = 'm03'
    expect(queue([src], 48).due).toHaveLength(0)
  })
})

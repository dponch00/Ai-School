// Examen con una IndexedDB en memoria (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { makeBank, seededRng } from '../domain/fixtures.test-utils'
import { Attempt, responseIssues } from '../domain/learner'
import { openDb, type LearnerDb } from './db'
import { examAttempts, retentionStatus, retryGate, selectExamAnswer, setExamConfidence, startExam, startRetention, submitExam } from './exam'
import { markLessonVisited } from './progress'

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-exam-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

const bank = makeBank(6, 2, 3)
const objectiveIds = [...new Set(bank.map((q) => q.evaluatedObjectiveId!))]
const course = { id: 'm02', version: '0.1.0', evaluatedObjectiveIds: objectiveIds }
const T0 = '2026-10-20T15:00:00.000Z'
const plus = (iso: string, hours: number) => new Date(new Date(iso).getTime() + hours * 3_600_000).toISOString()
const key = (a: Attempt, i: number) => a.items[i].question.options.find((o) => o.correct)!.id
const wrong = (a: Attempt, i: number) => a.items[i].question.options.find((o) => !o.correct)!.id

async function answerAll(a: Attempt, correctCount: number) {
  for (let i = 0; i < a.items.length; i++) {
    await selectExamAnswer(db, a.id, a.items[i].question.id, i < correctCount ? key(a, i) : wrong(a, i))
  }
}

describe('examen', () => {
  it('arma 12 preguntas, 2 por objetivo, y al volver devuelve el mismo examen en curso', async () => {
    const a = await startExam(db, course, bank, seededRng(1))
    expect(a.items).toHaveLength(12)
    for (const o of objectiveIds) expect(a.items.filter((it) => it.question.evaluatedObjectiveId === o)).toHaveLength(2)
    expect((await startExam(db, course, bank, seededRng(2))).id).toBe(a.id)
  })

  it('un cambio de respuesta queda como revisión y la primera selección se conserva', async () => {
    const a = await startExam(db, course, bank, seededRng(1))
    const qid = a.items[0].question.id
    await selectExamAnswer(db, a.id, qid, wrong(a, 0))
    await selectExamAnswer(db, a.id, qid, key(a, 0))
    const [r] = await db.responses.toArray()
    expect(r.firstSelectedOptionId).toBe(wrong(a, 0))
    expect(r.revisions.map((v) => v.selectedOptionId)).toEqual([key(a, 0)])
    expect(r.status).toBe('draft')
  })

  it('al enviar, el resultado queda congelado con la regla; 10 de 12 aprueba', async () => {
    const a = await startExam(db, course, bank, seededRng(1))
    await answerAll(a, 10)
    const done = await submitExam(db, a.id)
    expect(done.status).toBe('submitted')
    expect(done.result).toMatchObject({ correct: 10, total: 12, rule: { minCorrect: 10, requireEachObjective: true } })
    expect(responseIssues(done, await db.responses.toArray())).toEqual([])
    expect((await db.responses.toArray()).every((r) => r.status === 'submitted' && r.answeredAt)).toBe(true)
  })

  it('una pregunta sin responder cuenta como no acertada', async () => {
    const a = await startExam(db, course, bank, seededRng(1))
    await answerAll(a, 11)
    await db.responses.where('questionId').equals(a.items[11].question.id).delete()
    const done = await submitExam(db, a.id)
    expect(done.result?.correct).toBe(11)
  })

  it('no se puede responder un examen ya enviado', async () => {
    const a = await startExam(db, course, bank, seededRng(1))
    await submitExam(db, a.id)
    await expect(selectExamAnswer(db, a.id, a.items[0].question.id, key(a, 0))).rejects.toThrow()
  })

  it('el reintento cambia la variante de cada familia fallada', async () => {
    const first = await startExam(db, course, bank, seededRng(1), T0)
    await answerAll(first, 6)
    await submitExam(db, first.id, T0)
    await markLessonVisited(db, 'm02', 'm02-l2', plus(T0, 1))
    const failed = first.items.slice(6).map((it) => it.question)
    const retry = await startExam(db, course, bank, seededRng(3), plus(T0, 48))
    expect(retry.id).not.toBe(first.id)
    expect(retry.isFirstAttempt).toBe(false)
    for (const q of failed) {
      const again = retry.items.find((it) => it.question.family === q.family)
      if (again) expect(again.question.variant).not.toBe(q.variant)
    }
    expect(await examAttempts(db, 'm02')).toHaveLength(2)
  })

  it('el reintento exige repasar los apartados fallados y esperar al día siguiente (estándar §4.3)', async () => {
    const first = await startExam(db, course, bank, seededRng(1), T0)
    await answerAll(first, 6)
    await submitExam(db, first.id, T0)
    const before = await retryGate(db, 'm02', plus(T0, 1))
    expect(before).toMatchObject({ allowed: false, reason: 'review' })
    expect(before.pending).toEqual([{ lessonId: 'm02-l2', anchor: 'supuestos', visited: false }])
    await expect(startExam(db, course, bank, seededRng(2), plus(T0, 1))).rejects.toThrow('repasa')
    await markLessonVisited(db, 'm02', 'm02-l2', plus(T0, 2))
    expect(await retryGate(db, 'm02', plus(T0, 2))).toMatchObject({ allowed: false, reason: 'wait' })
    expect(await retryGate(db, 'm02', plus(T0, 48))).toMatchObject({ allowed: true, reason: 'ok' })
  })

  it('después de aprobar no hay reintento: sigue la retención', async () => {
    const a = await startExam(db, course, bank, seededRng(1), T0)
    await answerAll(a, 12)
    await submitExam(db, a.id, T0)
    expect(await retryGate(db, 'm02', plus(T0, 48))).toMatchObject({ allowed: false, reason: 'passed' })
    await expect(startExam(db, course, bank, seededRng(2), plus(T0, 48))).rejects.toThrow('retención')
  })

  it('la retención se habilita a los 7 días, usa una variante no vista por objetivo y 5 de 6 la comprueba', async () => {
    expect((await retentionStatus(db, 'm02', T0)).state).toBe('not-passed')
    const a = await startExam(db, course, bank, seededRng(1), T0)
    await answerAll(a, 12)
    await submitExam(db, a.id, T0)
    expect((await retentionStatus(db, 'm02', plus(T0, 24 * 6))).state).toBe('locked')
    await expect(startRetention(db, course, bank, seededRng(4), plus(T0, 24 * 6))).rejects.toThrow('se habilita')
    const r = await startRetention(db, course, bank, seededRng(4), plus(T0, 24 * 7 + 1))
    expect(r).toMatchObject({ kind: 'retention', status: 'in-progress' })
    expect(r.items).toHaveLength(6)
    const seen = new Set(a.items.map((it) => `${it.question.family}/${it.question.variant}`))
    for (const it of r.items) expect(seen.has(`${it.question.family}/${it.question.variant}`), it.question.id).toBe(false)
    expect(new Set(r.items.map((it) => it.question.evaluatedObjectiveId)).size).toBe(6)
    await answerAll(r, 5)
    const done = await submitExam(db, r.id, plus(T0, 24 * 7 + 2))
    expect(done.result).toMatchObject({ correct: 5, total: 6, passed: true, rule: { minCorrect: 5, requireEachObjective: false } })
    const after = await retentionStatus(db, 'm02', plus(T0, 24 * 7 + 3))
    expect(after.state).toBe('locked')
    expect(after.last?.id).toBe(r.id)
  })

  it('la confianza se guarda en la respuesta elegida y se puede quitar', async () => {
    const a = await startExam(db, course, bank, seededRng(1), T0)
    const qid = a.items[0].question.id
    await expect(setExamConfidence(db, a.id, qid, 'high')).rejects.toThrow('Primero')
    await selectExamAnswer(db, a.id, qid, key(a, 0))
    await setExamConfidence(db, a.id, qid, 'high')
    expect((await db.responses.toArray())[0].confidence).toBe('high')
    await setExamConfidence(db, a.id, qid, undefined)
    expect((await db.responses.toArray())[0].confidence).toBeUndefined()
  })
})

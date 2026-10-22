// Examen con una IndexedDB en memoria (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { makeBank, seededRng } from '../domain/fixtures.test-utils'
import { Attempt, responseIssues } from '../domain/learner'
import { openDb, type LearnerDb } from './db'
import { examAttempts, selectExamAnswer, startExam, submitExam } from './exam'

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
    const first = await startExam(db, course, bank, seededRng(1))
    await answerAll(first, 6)
    await submitExam(db, first.id)
    const failed = first.items.slice(6).map((it) => it.question)
    const retry = await startExam(db, course, bank, seededRng(3))
    expect(retry.id).not.toBe(first.id)
    expect(retry.isFirstAttempt).toBe(false)
    for (const q of failed) {
      const again = retry.items.find((it) => it.question.family === q.family)
      if (again) expect(again.question.variant).not.toBe(q.variant)
    }
    expect(await examAttempts(db, 'm02')).toHaveLength(2)
  })
})

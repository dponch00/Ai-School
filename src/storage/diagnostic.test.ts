// Diagnóstico inicial con el contenido real y una IndexedDB en memoria (fake-indexeddb).
import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DiagnosticForm, Microtask, Question } from '../domain/content'
import { seededRng } from '../domain/fixtures.test-utils'
import type { Attempt } from '../domain/learner'
import { openDb, type LearnerDb } from './db'
import { blockResults, getMicrotask, microtaskCriticalOk, saveMicrotask, splitMicrotaskText, startDiagnostic } from './diagnostic'
import { selectExamAnswer, setExamConfidence, submitExam } from './exam'

const read = (p: string) => JSON.parse(readFileSync(resolve(import.meta.dirname, '../../content/diagnostic', p), 'utf8'))
const form = DiagnosticForm.parse(read('form.json'))
const questions = Object.fromEntries(Question.array().parse(read('items.json')).map((q) => [q.id, q]))
const microtasks = Microtask.array().parse(read('microtasks.json'))

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-dx-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

const key = (a: Attempt, i: number) => a.items[i].question.options.find((o) => o.correct)!.id
const wrong = (a: Attempt, i: number) => a.items[i].question.options.find((o) => !o.correct)!.id

describe('diagnóstico inicial', () => {
  it('arma las 24 preguntas agrupadas por bloque, en el orden del formulario, y lo retoma', async () => {
    const a = await startDiagnostic(db, form, questions, seededRng(1))
    expect(a.items).toHaveLength(24)
    expect(a.kind).toBe('diagnostic')
    const blocks = a.items.map((it) => it.question.diagnosticBlock)
    expect([...new Set(blocks)]).toEqual(form.blocks.map((b) => b.id))
    expect((await startDiagnostic(db, form, questions, seededRng(2))).id).toBe(a.id)
  })

  it('se envía sin «aprobado» y se lee por bloques, con conteos y señales (D-015)', async () => {
    const a = await startDiagnostic(db, form, questions, seededRng(1))
    // B1 todo correcto; B2 todo incorrecto con mucha seguridad; el resto sin responder
    for (let i = 0; i < a.items.length; i++) {
      const block = a.items[i].question.diagnosticBlock
      if (block === 'B1') await selectExamAnswer(db, a.id, a.items[i].question.id, key(a, i))
      if (block === 'B2') {
        await selectExamAnswer(db, a.id, a.items[i].question.id, wrong(a, i))
        await setExamConfidence(db, a.id, a.items[i].question.id, 'high')
      }
    }
    const done = await submitExam(db, a.id)
    expect(done.status).toBe('submitted')
    expect(done.result).toBeUndefined()
    const results = blockResults(form, done, await db.responses.toArray(), [])
    const b1 = results.find((r) => r.blockId === 'B1')!
    const b2 = results.find((r) => r.blockId === 'B2')!
    expect(b1).toMatchObject({ correct: 4, total: 4, signal: 'likely-strength' })
    expect(b2).toMatchObject({ correct: 0, highConfidenceErrors: 4, signal: 'review-recommended' })
    expect(results.find((r) => r.blockId === 'B3')!.signal).toBe('review-recommended')
  })

  it('la microtarea se guarda con sus dos respuestas y su autoevaluación decide los criterios críticos', async () => {
    const m = microtasks[0]
    expect(microtaskCriticalOk(m, await getMicrotask(db, m.id))).toBeUndefined()
    const all = (level: 1 | 2 | 3) => m.rubric.map((c) => ({ criterionId: c.id, level, evidence: 'cita' }))
    const s1 = await saveMicrotask(db, m, { firstAnswer: 'Falta el objetivo', taskAnswer: 'Spec breve', selfAssessment: all(2) })
    expect(s1.state).toBe('self-assessed')
    expect(splitMicrotaskText(s1.text)).toEqual({ firstAnswer: 'Falta el objetivo', taskAnswer: 'Spec breve' })
    expect(microtaskCriticalOk(m, s1)).toBe(true)
    const s2 = await saveMicrotask(db, m, { firstAnswer: 'x', taskAnswer: 'y', selfAssessment: all(1) })
    expect(s2.id).toBe(s1.id)
    expect(microtaskCriticalOk(m, s2)).toBe(false)
  })
})

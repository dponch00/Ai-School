import { describe, expect, it } from 'vitest'
import { Course, Question } from './content'
import { Attempt, finalSelection, Response } from './learner'
import { bankIssues, diagnosticBlockSignal, scoreAttempt, selectExam } from './scoring'
import { answer, makeAttempt, makeBank, makeQuestion, seededRng } from './fixtures.test-utils'

describe('Question', () => {
  it('acepta un ítem de examen bien formado', () => {
    expect(Question.safeParse(makeQuestion()).success).toBe(true)
  })

  it('rechaza dos opciones correctas', () => {
    const q = makeQuestion()
    q.options[1] = { ...q.options[1], correct: true }
    expect(Question.safeParse(q).success).toBe(false)
  })

  it('rechaza un distractor sin concepto erróneo (relleno)', () => {
    const q = makeQuestion()
    q.options[2] = { ...q.options[2], misconceptionId: undefined }
    const r = Question.safeParse(q)
    expect(r.success).toBe(false)
    expect(JSON.stringify(r.error?.issues)).toContain('misconceptionId')
  })

  it('exige familia y variante en ítems de examen', () => {
    expect(Question.safeParse(makeQuestion({ family: undefined })).success).toBe(false)
  })

  it('exige bloque en ítems de diagnóstico', () => {
    expect(Question.safeParse(makeQuestion({ use: 'diagnostic', courseId: null })).success).toBe(false)
    expect(Question.safeParse(makeQuestion({ use: 'diagnostic', courseId: null, diagnosticBlock: 'B2' })).success).toBe(true)
  })

  it('marca escenarios de más de 120 palabras', () => {
    const long = Array.from({ length: 125 }, () => 'palabra').join(' ')
    expect(Question.safeParse(makeQuestion({ scenario: long })).success).toBe(false)
  })
})

describe('Course', () => {
  const course = {
    id: 'm02', version: '0.1.0', title: 'Prompting', centralQuestion: '¿Cómo convierto una idea ambigua en una tarea verificable?',
    competencyIds: ['C02'], lessonIds: ['m02-l1', 'm02-l2', 'm02-l3', 'm02-l4', 'm02-l5', 'm02-l6'], practiceId: 'm02-lab',
    estimatedMinutes: 240, volatility: 'medium', reviewCadence: 'annual', status: 'draft',
  }
  const objective = (n: number) => ({ id: `m02-eo${n}`, statement: 'Dado un caso, redacta un criterio verificable', competencyIds: ['C02'] })

  it('acepta hasta 6 objetivos evaluados y rechaza 7 (D-017)', () => {
    expect(Course.safeParse({ ...course, evaluatedObjectives: [1, 2, 3, 4, 5, 6].map(objective) }).success).toBe(true)
    expect(Course.safeParse({ ...course, evaluatedObjectives: [1, 2, 3, 4, 5, 6, 7].map(objective) }).success).toBe(false)
  })
})

describe('Attempt', () => {
  it('rechaza un orden mostrado que no coincide con las opciones congeladas', () => {
    const a = makeAttempt([makeQuestion()])
    a.items[0].shownOptionIds = ['k1', 'd1', 'zz']
    expect(Attempt.safeParse(a).success).toBe(false)
  })

  it('conserva la primera respuesta y usa la última revisión como selección final', () => {
    const r = answer('attempt-0001', makeQuestion(), 'd1', { revisions: [{ selectedOptionId: 'k1', at: '2026-10-21T10:12:00-06:00' }] })
    expect(r.firstSelectedOptionId).toBe('d1')
    expect(finalSelection(r)).toBe('k1')
  })
})

describe('scoreAttempt', () => {
  const twelve = () => selectExam({ bank: makeBank(), evaluatedObjectiveIds: [1, 2, 3, 4, 5, 6].map((n) => `m02-eo${n}`), itemsPerObjective: 2, rng: seededRng(7) })

  it('aprueba con 10/12 si ningún objetivo quedó sin aciertos', () => {
    const items = twelve().map((s) => s.question)
    const attempt = makeAttempt(items)
    // Falla un ítem de dos objetivos distintos.
    const failObjectives = new Set<string>()
    const responses = items.map((q) => {
      if (!failObjectives.has(q.evaluatedObjectiveId!) && failObjectives.size < 2) {
        failObjectives.add(q.evaluatedObjectiveId!)
        return answer(attempt.id, q, 'd1')
      }
      return answer(attempt.id, q, 'k1')
    })
    const r = scoreAttempt(attempt, responses)
    expect(r.correct).toBe(10)
    expect(r.passed).toBe(true)
  })

  it('no aprueba con 10/12 si los dos ítems de un objetivo fallaron', () => {
    const items = twelve().map((s) => s.question)
    const attempt = makeAttempt(items)
    const responses = items.map((q) => answer(attempt.id, q, q.evaluatedObjectiveId === 'm02-eo3' ? 'd2' : 'k1'))
    const r = scoreAttempt(attempt, responses)
    expect(r.correct).toBe(10)
    expect(r.passed).toBe(false)
    expect(r.reasons.join(' ')).toContain('m02-eo3')
  })

  it('puntúa con la clave congelada aunque la pregunta cambie después', () => {
    const original = makeQuestion()
    const attempt = makeAttempt([original])
    // Una versión posterior cambia la clave a d1; el intento antiguo no debe reinterpretarse.
    const v2 = makeQuestion({ version: 2, options: original.options.map((o) => ({ ...o, correct: o.id === 'd1' })) })
    expect(v2.options.find((o) => o.correct)!.id).toBe('d1')
    const r = scoreAttempt(attempt, [answer(attempt.id, original, 'k1')], { minCorrect: 1, requireEachObjective: true })
    expect(r.correct).toBe(1)
  })

  it('cuenta un borrador como sin respuesta, no como error elegido', () => {
    const q = makeQuestion()
    const attempt = makeAttempt([q])
    const r = scoreAttempt(attempt, [answer(attempt.id, q, 'k1', { status: 'draft' })], { minCorrect: 1, requireEachObjective: false })
    expect(r.correct).toBe(0)
    expect(r.unanswered).toEqual([q.id])
  })
})

describe('selectExam', () => {
  const objectives = [1, 2, 3, 4, 5, 6].map((n) => `m02-eo${n}`)

  it('elige 2 ítems por objetivo, de familias distintas', () => {
    const items = selectExam({ bank: makeBank(), evaluatedObjectiveIds: objectives, itemsPerObjective: 2, rng: seededRng(1) })
    expect(items).toHaveLength(12)
    const families = items.map((s) => s.question.family)
    expect(new Set(families).size).toBe(12)
    for (const o of objectives) expect(items.filter((s) => s.question.evaluatedObjectiveId === o)).toHaveLength(2)
  })

  it('cambia de variante en las familias falladas', () => {
    const items = selectExam({
      bank: makeBank(1, 2, 3), evaluatedObjectiveIds: ['m02-eo1'], itemsPerObjective: 2, rng: seededRng(3),
      usedVariantsByFamily: { 'm02-o1f1': ['a', 'b'] }, failedFamilies: ['m02-o1f1'],
    })
    expect(items.find((s) => s.question.family === 'm02-o1f1')!.question.variant).toBe('c')
  })

  it('avisa en vez de repetir cuando una familia fallada no tiene variantes nuevas', () => {
    expect(() =>
      selectExam({
        bank: makeBank(1, 2, 3), evaluatedObjectiveIds: ['m02-eo1'], itemsPerObjective: 2, rng: seededRng(3),
        usedVariantsByFamily: { 'm02-o1f1': ['a', 'b', 'c'] }, failedFamilies: ['m02-o1f1'],
      }),
    ).toThrow(/sin ver/)
  })

  it('respeta fixedOrder en opciones numéricas', () => {
    const bank = makeBank(1, 2, 1).map((q) => ({ ...q, fixedOrder: true }))
    const items = selectExam({ bank, evaluatedObjectiveIds: ['m02-eo1'], itemsPerObjective: 2, rng: seededRng(9) })
    for (const s of items) expect(s.shownOptionIds).toEqual(s.question.options.map((o) => o.id))
  })
})

describe('diagnosticBlockSignal', () => {
  const block = (pattern: Array<['base' | 'advanced', boolean, ('low' | 'medium' | 'high')?]>) =>
    pattern.map(([difficulty, ok, confidence], i) => {
      const item = makeQuestion({ id: `dx-${i}`, use: 'diagnostic', courseId: null, diagnosticBlock: 'B2', difficulty })
      return { item, response: answer('attempt-dx', item, ok ? 'k1' : 'd1', { confidence }) }
    })

  it('da fortaleza probable con 3/4 y los dos avanzados correctos', () => {
    expect(diagnosticBlockSignal(block([['base', true], ['base', false], ['advanced', true], ['advanced', true]]))).toBe('likely-strength')
  })

  it('no da fortaleza si hay un error con confianza alta', () => {
    expect(diagnosticBlockSignal(block([['base', true], ['base', true], ['advanced', true], ['advanced', false, 'high']]))).toBe('no-clear-signal')
  })

  it('recomienda repaso si falla los dos de base', () => {
    expect(diagnosticBlockSignal(block([['base', false], ['base', false], ['advanced', true], ['advanced', true]]))).toBe('review-recommended')
  })
})

describe('casos reproducibles de la revisión T-004', () => {
  it('CTR-01: respuestas duplicadas invalidan el intento en vez de depender del orden', () => {
    const q = makeQuestion()
    const attempt = makeAttempt([q])
    const dup = [answer(attempt.id, q, 'k1', { id: 'resp-aaaa1' }), answer(attempt.id, q, 'd1', { id: 'resp-aaaa2' })]
    expect(() => scoreAttempt(attempt, dup)).toThrow(/más de una respuesta/)
  })

  it('CTR-01: una opción que no se mostró invalida el intento', () => {
    const q = makeQuestion()
    const attempt = makeAttempt([q])
    expect(() => scoreAttempt(attempt, [answer(attempt.id, q, 'zz')])).toThrow(/no se mostró/)
  })

  it('CTR-03: una familia repartida entre dos objetivos se rechaza', () => {
    const bank = [
      makeQuestion({ id: 'q-a', family: 'm02-f', variant: 'a', evaluatedObjectiveId: 'm02-eo1' }),
      makeQuestion({ id: 'q-b', family: 'm02-f', variant: 'b', evaluatedObjectiveId: 'm02-eo2' }),
    ]
    expect(bankIssues(bank).join(' ')).toContain('varios objetivos')
    expect(() => selectExam({ bank, evaluatedObjectiveIds: ['m02-eo1', 'm02-eo2'], itemsPerObjective: 1, rng: seededRng(2) })).toThrow(/incoherente/)
  })

  it('CTR-04: tres ítems no dan señal, sino evidencia incompleta', () => {
    const items = (['base', 'advanced', 'advanced'] as const).map((difficulty, i) =>
      makeQuestion({ id: `dx-${i}`, use: 'diagnostic', courseId: null, diagnosticBlock: 'B2', difficulty }),
    )
    expect(diagnosticBlockSignal(items.map((item) => ({ item, response: answer('attempt-dx', item, 'k1') })))).toBe('incomplete-evidence')
  })

  it('CTR-06: una respuesta enviada sin fecha y un examen enviado sin resultado se rechazan', () => {
    const q = makeQuestion()
    expect(Response.safeParse(answer('attempt-0001', q, 'k1', { answeredAt: undefined })).success).toBe(false)
    expect(Attempt.safeParse(makeAttempt([q], { result: undefined })).success).toBe(false)
  })

  it('DX-01: preguntas y conceptos erróneos sin fuente se rechazan', () => {
    expect(Question.safeParse(makeQuestion({ sourceIds: [] })).success).toBe(false)
  })
})

describe('selectExam en un curso piloto', () => {
  const drafts = makeBank().map((q) => ({ ...q, status: 'draft' as const }))
  const objectives = [1, 2, 3, 4, 5, 6].map((n) => `m02-eo${n}`)
  it('sin allowDraft, los borradores no entran al examen', () => {
    expect(() => selectExam({ bank: drafts, evaluatedObjectiveIds: objectives, itemsPerObjective: 2, rng: seededRng(1) })).toThrow()
  })
  it('con allowDraft, el examen se arma con borradores', () => {
    expect(selectExam({ bank: drafts, evaluatedObjectiveIds: objectives, itemsPerObjective: 2, rng: seededRng(1), allowDraft: true })).toHaveLength(12)
  })
})

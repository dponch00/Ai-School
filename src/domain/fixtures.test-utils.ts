// Datos sintéticos para las pruebas del dominio. No es contenido del curso.
import type { Question } from './content'
import type { Attempt, Response } from './learner'

export function makeQuestion(over: Partial<Question> = {}): Question {
  return {
    id: 'm02-f01-a',
    version: 1,
    use: 'exam',
    courseId: 'm02',
    evaluatedObjectiveId: 'm02-eo1',
    competencyIds: ['C02'],
    difficulty: 'base',
    process: 'apply',
    family: 'm02-f01',
    variant: 'a',
    scenario: 'El comité comercial de Altiplano pide un dashboard del pipeline sin decir moneda ni fecha de corte.',
    stem: '¿Cuál es el mejor siguiente paso antes de pedir la implementación?',
    options: [
      { id: 'k1', text: 'Declarar moneda, fecha de corte y política de probabilidades como supuestos', correct: true, feedback: 'Correcta: sin esos supuestos el total del pipeline es ambiguo y no se puede verificar.' },
      { id: 'd1', text: 'Pedir al agente que elija la moneda que le parezca más común', correct: false, misconceptionId: 'm02-mc01', feedback: 'El modelo no conoce la política de FP&A; delegarle un supuesto de negocio lo vuelve invisible.' },
      { id: 'd2', text: 'Empezar a construir y corregir la moneda después de ver el resultado', correct: false, misconceptionId: 'm02-mc02', feedback: 'Corregir después obliga a rehacer cálculos y no deja un criterio de aceptación verificable.' },
    ],
    fixedOrder: false,
    sectionRef: 'm02-l2#supuestos',
    sourceIds: [],
    status: 'published',
    publishedAt: '2026-10-21',
    ...over,
  }
}

/** Banco con `objectives` objetivos × `families` familias × `variants` variantes. */
export function makeBank(objectives = 6, families = 2, variants = 3): Question[] {
  const bank: Question[] = []
  for (let o = 1; o <= objectives; o++) {
    for (let f = 1; f <= families; f++) {
      for (let v = 0; v < variants; v++) {
        const variant = 'abc'[v]
        const family = `m02-o${o}f${f}`
        bank.push(makeQuestion({ id: `${family}-${variant}`, family, variant, evaluatedObjectiveId: `m02-eo${o}` }))
      }
    }
  }
  return bank
}

export function makeAttempt(questions: Question[], over: Partial<Attempt> = {}): Attempt {
  return {
    id: 'attempt-0001',
    kind: 'exam',
    courseId: 'm02',
    contentVersion: '0.1.0',
    formLabel: 'examen M02 v1',
    isFirstAttempt: true,
    startedAt: '2026-10-21T10:00:00-06:00',
    submittedAt: '2026-10-21T10:25:00-06:00',
    status: 'submitted',
    items: questions.map((question) => ({ question, shownOptionIds: question.options.map((o) => o.id) })),
    ...over,
  }
}

export function answer(attemptId: string, q: Question, optionId: string | null, over: Partial<Response> = {}): Response {
  return {
    id: `resp-${q.id}`.slice(0, 64),
    attemptId,
    questionId: q.id,
    questionVersion: q.version,
    firstSelectedOptionId: optionId,
    revisions: [],
    feedbackSeenBeforeAnswer: false,
    status: 'submitted',
    answeredAt: '2026-10-21T10:10:00-06:00',
    ...over,
  }
}

/** RNG determinista (mulberry32) para que las pruebas sean reproducibles. */
export function seededRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Reporte de evaluación: escape, exclusiones explícitas y conciliación del resumen con el detalle.
import { describe, expect, it } from 'vitest'
import { makeAttempt, makeQuestion } from '../domain/fixtures.test-utils'
import type { Practice } from '../domain/content'
import type { Attempt, PracticeSubmission, Profile, Response } from '../domain/learner'
import type { LearnerRecord } from '../storage/learner'
import { buildReport, escapeHtml, type ReportOptions } from './build'

const INJECTION = '</pre><script>alert("x")</script><img src=x onerror=alert(1)>'

const q1 = makeQuestion({ id: 'm02-l1-c1', use: 'check', competencyIds: ['C02'] })
const q2 = makeQuestion({ id: 'm02-l1-c2', use: 'check', competencyIds: ['C02', 'C07'] })
const check: Attempt = makeAttempt([q1, q2], { id: 'attempt-check-1', kind: 'check', formLabel: 'comprobaciones m02-l1', result: undefined, submittedAt: '2026-10-21T10:25:00-06:00' })
const exam: Attempt = makeAttempt([makeQuestion({ id: 'm02-f01-a', competencyIds: ['C02'] })], { id: 'attempt-exam-1', submittedAt: '2026-10-22T09:00:00-06:00' })
const open: Attempt = makeAttempt([q1], { id: 'attempt-open-1', status: 'in-progress', submittedAt: undefined, result: undefined })

const resp = (attemptId: string, questionId: string, first: string, over: Partial<Response> = {}): Response => ({
  id: `resp-${attemptId}-${questionId}`.slice(0, 60),
  attemptId,
  questionId,
  questionVersion: 1,
  firstSelectedOptionId: first,
  revisions: [],
  feedbackSeenBeforeAnswer: false,
  status: 'submitted',
  answeredAt: '2026-10-21T10:20:00-06:00',
  ...over,
})

const profile: Profile = {
  localId: 'perfil-abcdef123456',
  updatedAt: '2026-10-21T09:00:00-06:00',
  declared: { alias: 'D', professionalContext: 'Finanzas', goals: ['Especificar mejor'], projects: [], tools: ['Un agente de código'], selfAssessment: [], constraints: ['Solo datos sintéticos'] },
  priorEvidence: [],
}

const practice = {
  id: 'm02-lab', courseId: 'm02', version: '1.0.0', title: 'Laboratorio M02', evaluatedObjectiveIds: ['m02-eo1'], inputs: ['x'], instructionsPath: 'x.md',
  deliverable: 'brief, criterios y prompt', evidenceRequired: ['brief'],
  rubric: [{ id: 'r1', name: 'Objetivo', critical: true, levels: [{ level: 1, descriptor: 'a' }] }],
  anchors: { achieved: 'logrado xx', insufficient: 'insuficiente' }, transferNotebook: true, status: 'draft',
} as unknown as Practice

const submission: PracticeSubmission = {
  id: 'submission-0001', practiceId: 'm02-lab', practiceVersion: '1.0.0', createdAt: '2026-10-21T11:00:00-06:00',
  text: 'Mi brief ' + INJECTION,
  evidence: [{ kind: 'link', value: 'https://interno.ejemplo/privado', includedInReport: false }, { kind: 'text', value: 'salida del script: 16/16', includedInReport: true }],
  selfAssessment: [{ criterionId: 'r1', level: 2, evidence: 'sección 1 del brief' }], reviews: [], state: 'presented',
}

const record = (over: Partial<LearnerRecord> = {}): LearnerRecord => ({
  profile,
  attempts: [check, exam, open],
  responses: [
    resp(check.id, q1.id, 'k1', { explanation: 'Porque ' + INJECTION, confidence: 'high', declaredHelp: 'none' }),
    resp(check.id, q2.id, 'd1', { revisions: [{ selectedOptionId: 'k1', at: '2026-10-21T10:21:00-06:00' }] }),
    resp(exam.id, 'm02-f01-a', 'd2'),
  ],
  submissions: [submission],
  feedback: [],
  adjustments: [],
  reports: [],
  ...over,
})

const ctx = { courses: [{ id: 'm02', title: 'Prompting avanzado', version: '0.1.0' }], competencies: { C02: { name: 'Especificación ejecutable' }, C07: { name: 'Dirección del ciclo' } }, practices: [practice] }
const opts = (over: Partial<ReportOptions> = {}): ReportOptions => ({
  reportId: 'report-0123456789',
  generatedAt: '2026-10-22T12:00:00.000Z',
  timezone: 'America/Mexico_City',
  appVersion: '0.1.0',
  scope: { kind: 'course', courseId: 'm02' },
  profileFields: ['alias', 'goals', 'tools', 'constraints'],
  sections: { checks: true, practiceQuestions: true, exams: true, labs: true, explanations: true },
  questionsForEvaluator: '¿Mi criterio sobre supuestos es sólido? ' + INJECTION,
  ...over,
})

function jsonBlock(html: string): Record<string, unknown> {
  const raw = html.split('<section id="datos">')[1].split('<pre>')[1].split('</pre>')[0]
  const text = raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  return JSON.parse(text)
}

describe('reporte de evaluación', () => {
  it('escapa todo el texto del alumno: no hay scripts, etiquetas ni atributos inyectados', () => {
    const { html } = buildReport(record(), ctx, opts())
    expect(html).not.toMatch(/<script/i)
    expect(html).not.toMatch(/<img/i)
    expect(html).not.toMatch(/<[a-z][^>]*onerror/i)
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(html).toContain("Content-Security-Policy\" content=\"default-src 'none'")
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;')
  })

  it('el JSON pasivo se puede leer y concilia con el detalle y el resumen', () => {
    const built = buildReport(record(), ctx, opts())
    const data = jsonBlock(built.html) as { responses: unknown[]; summary: { byCompetency: { competencyId: string; correct: number; total: number }[] } }
    expect(data.responses).toHaveLength(built.rows.length)
    expect(built.rows).toHaveLength(3)
    for (const c of data.summary.byCompetency) {
      const rows = built.rows.filter((r) => r.competencyIds.includes(c.competencyId))
      expect(c.total, c.competencyId).toBe(rows.length)
      expect(c.correct, c.competencyId).toBe(rows.filter((r) => r.correct).length)
    }
  })

  it('la primera respuesta y sus cambios se conservan; la corrección usa la selección final', () => {
    const { rows } = buildReport(record(), ctx, opts())
    const r = rows.find((x) => x.questionId === 'm02-l1-c2')!
    expect(r.firstSelectedOptionId).toBe('d1')
    expect(r.finalSelectedOptionId).toBe('k1')
    expect(r.correct).toBe(true)
  })

  it('lo excluido se dice explícitamente: secciones, explicaciones, campos del perfil e intentos en curso', () => {
    const built = buildReport(record(), ctx, opts({ sections: { checks: true, practiceQuestions: true, exams: false, labs: true, explanations: false }, profileFields: ['alias'] }))
    const ex = built.record.excluded.join(' | ')
    expect(ex).toContain('Exámenes: 1 intento(s)')
    expect(ex).toContain('1 explicación(es)')
    expect(ex).toContain('Contexto profesional')
    expect(ex).toContain('1 intento(s) en curso')
    expect(built.html).not.toContain('Porque &lt;/pre&gt;')
    expect(built.html).not.toContain('Finanzas')
  })

  it('el periodo deja fuera lo anterior y lo cuenta', () => {
    const built = buildReport(record(), ctx, opts({ scope: { kind: 'course', courseId: 'm02', from: '2026-10-22' } }))
    expect(built.record.counts.attempts).toBe(1)
    expect(built.record.excluded.join(' ')).toContain('1 intento(s) fuera del periodo')
  })

  it('una evidencia no incorporada aparece como pendiente de inspección, sin su contenido', () => {
    const { html } = buildReport(record(), ctx, opts())
    expect(html).toContain('pendiente de inspección')
    expect(html).not.toContain('interno.ejemplo')
    expect(html).toContain('salida del script: 16/16')
  })

  it('el Markdown trae el mismo contexto, con la instrucción de evaluación', () => {
    const { markdown } = buildReport(record(), ctx, opts())
    expect(markdown).toContain('m02-l1-c2 v1')
    expect(markdown).toContain('Quiero que evalúes mi aprendizaje de IA')
    expect(markdown).toContain('Lo que queda fuera')
  })

  it('compara con reportes anteriores', () => {
    const prev = buildReport(record(), ctx, opts({ reportId: 'report-anterior-01', generatedAt: '2026-10-21T23:00:00.000Z' })).record
    const { html } = buildReport(record({ reports: [prev] }), ctx, opts())
    expect(html).toContain('report-anterior-01')
  })
})

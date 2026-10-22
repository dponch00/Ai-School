// Perfil, entrega de práctica, reportes y migración de la base (fake-indexeddb).
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Practice } from '../domain/content'
import { openDb, type LearnerDb } from './db'
import { addPracticeReview, getProfile, getSubmission, listReports, reviewPrompt, saveProfile, saveReport, saveSubmission } from './learner'
import { recordCheckAnswer } from './progress'
import { makeQuestion } from '../domain/fixtures.test-utils'

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-learner-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

const practice = {
  id: 'm02-lab',
  courseId: 'm02',
  version: '1.0.0',
  title: 'Laboratorio',
  evaluatedObjectiveIds: ['m02-eo1'],
  inputs: ['datos'],
  instructionsPath: 'x.md',
  deliverable: 'brief, criterios y prompt',
  evidenceRequired: ['brief'],
  rubric: [1, 2, 3].map((i) => ({ id: `r${i}`, name: `Criterio ${i}`, critical: i === 1, evaluatedObjectiveIds: ['m02-eo1'], levels: [1, 2, 3, 4].map((level) => ({ level, descriptor: `nivel ${level} del criterio ${i}` })) })),
  anchors: { achieved: 'ejemplo logrado', insufficient: 'ejemplo insuficiente' },
  transferNotebook: true,
  status: 'draft',
} as unknown as Practice

const notebook = { initialDecision: 'a', counterexample: 'b', revisedDecision: 'c', evidenceForChange: 'd' }
const self = (ids: string[]) => ids.map((criterionId) => ({ criterionId, level: 2 as const, evidence: 'cita' }))

describe('perfil', () => {
  it('se crea con un ID local que no cambia al editarlo', async () => {
    const a = await saveProfile(db, { declared: { alias: 'D', goals: ['especificar mejor'] } as never, priorEvidence: [] })
    const b = await saveProfile(db, { declared: { alias: 'D.', goals: [] } as never, priorEvidence: [] })
    expect(b.localId).toBe(a.localId)
    expect((await getProfile(db))?.declared.alias).toBe('D.')
    expect(await db.profile.count()).toBe(1)
  })

  it('rechaza textos más largos que el límite del contrato', async () => {
    await expect(saveProfile(db, { declared: { alias: 'x'.repeat(81), goals: [] } as never, priorEvidence: [] })).rejects.toThrow()
  })
})

describe('entrega de práctica', () => {
  it('sin cuaderno queda presentada; con cuaderno y todos los criterios, autoevaluada', async () => {
    const a = await saveSubmission(db, practice, { text: 'mi brief', evidence: [], selfAssessment: self(['r1', 'r2', 'r3']) })
    expect(a.state).toBe('presented')
    const b = await saveSubmission(db, practice, { text: 'mi brief', evidence: [], notebook, selfAssessment: self(['r1', 'r2', 'r3']) })
    expect(b.state).toBe('self-assessed')
    expect(b.id).toBe(a.id)
    expect((await getSubmission(db, 'm02-lab'))?.state).toBe('self-assessed')
  })

  it('una autoevaluación incompleta no cuenta como autoevaluada', async () => {
    const s = await saveSubmission(db, practice, { text: 'x', evidence: [], notebook, selfAssessment: self(['r1']) })
    expect(s.state).toBe('presented')
  })
})

describe('revisiones externas de la práctica (F2-02)', () => {
  const review = (runId: string, levels: (1 | 2 | 3 | 4)[]) => ({
    runId,
    reviewer: { declaredName: 'Revisor', type: 'external-assisted' as const },
    criteria: levels.map((level, i) => ({ criterionId: `r${i + 1}`, evidenceQuote: 'cita', level })),
  })
  const ready = () => saveSubmission(db, practice, { text: 'mi brief', evidence: [], notebook, selfAssessment: self(['r1', 'r2', 'r3']) })

  it('sin entrega no se puede registrar una revisión', async () => {
    await expect(addPracticeReview(db, practice, review('run-0001', [3, 3, 3]))).rejects.toThrow('Primero guarda')
  })

  it('una entrega solo presentada (sin cuaderno o autoevaluación completa) no admite revisiones', async () => {
    await saveSubmission(db, practice, { text: 'mi brief', evidence: [], selfAssessment: self(['r1']) })
    await expect(addPracticeReview(db, practice, review('run-0001', [3, 3, 3]))).rejects.toThrow('autoevaluación')
  })

  it('una revisión deja la entrega en revisión pendiente; dos de corridas distintas y cercanas, revisada', async () => {
    await ready()
    expect((await addPracticeReview(db, practice, review('run-0001', [3, 2, 3]))).state).toBe('review-pending')
    expect((await addPracticeReview(db, practice, review('run-0002', [2, 2, 4]))).state).toBe('reviewed')
  })

  it('dos revisiones de la misma corrida no son independientes', async () => {
    await ready()
    await addPracticeReview(db, practice, review('run-0001', [3, 3, 3]))
    expect((await addPracticeReview(db, practice, review('run-0001', [3, 3, 3]))).state).toBe('review-pending')
  })

  it('una discrepancia de más de un nivel deja la revisión pendiente', async () => {
    await ready()
    await addPracticeReview(db, practice, review('run-0001', [4, 3, 3]))
    expect((await addPracticeReview(db, practice, review('run-0002', [2, 3, 3]))).state).toBe('review-pending')
  })

  it('con revisiones, el texto revisado ya no se puede cambiar; la autoevaluación sí', async () => {
    await ready()
    await addPracticeReview(db, practice, review('run-0001', [3, 3, 3]))
    await expect(saveSubmission(db, practice, { text: 'otro brief', evidence: [], notebook, selfAssessment: self(['r1', 'r2', 'r3']) })).rejects.toThrow('revisiones externas')
    const ok = await saveSubmission(db, practice, { text: 'mi brief', evidence: [], notebook, selfAssessment: [{ criterionId: 'r1', level: 3, evidence: 'otra cita' }, ...self(['r2', 'r3'])] })
    expect(ok.reviews).toHaveLength(1)
  })

  it('rechaza una revisión que no evalúa todos los criterios', async () => {
    await ready()
    await expect(addPracticeReview(db, practice, review('run-0001', [3, 3]))).rejects.toThrow('cada criterio')
  })

  it('la instrucción para el revisor pide la cita antes del nivel e incluye la rúbrica', () => {
    const p = reviewPrompt(practice)
    expect(p).toContain('primero cita textualmente')
    expect(p).toContain('Criterio 1 (crítico)')
    expect(p).toContain('4. nivel 4 del criterio 3')
    expect(p).toContain('nivel del 1 al 4')
  })
})

describe('reportes', () => {
  it('se guardan y se listan por fecha', async () => {
    const base = {
      cutoffAt: '2026-10-22T10:00:00.000Z',
      scope: { kind: 'course' as const, courseId: 'm02' },
      fileName: 'evaluacion_ia_2026-10-22_abcd.html',
      includedSections: ['perfil'],
      excluded: [],
      counts: { attempts: 1, responses: 4, practices: 0 },
      byCompetency: [{ competencyId: 'C02', correct: 3, total: 4 }],
    }
    await saveReport(db, { ...base, id: 'report-0002', createdAt: '2026-10-23T10:00:00.000Z' })
    await saveReport(db, { ...base, id: 'report-0001', createdAt: '2026-10-22T10:00:00.000Z' })
    expect((await listReports(db)).map((r) => r.id)).toEqual(['report-0001', 'report-0002'])
  })
})

describe('migración', () => {
  it('una base v1 con datos abre en v2 sin perder nada y con la tabla de reportes', async () => {
    const name = `ai-school-migracion-${++n}`
    const v1 = new Dexie(name)
    v1.version(1).stores({
      profile: 'localId',
      attempts: 'id, formLabel, courseId, kind, status',
      responses: 'id, attemptId, questionId',
      practiceSubmissions: 'id, practiceId',
      feedback: 'id, &textHash',
      adjustments: 'id, state',
      notes: 'id, targetId',
      bookmarks: 'id, targetId',
      lessonProgress: 'key, courseId',
    })
    await v1.open()
    // Datos escritos por la versión anterior de la app, antes de existir la tabla de reportes.
    await v1.table('lessonProgress').put({ key: 'm02/m02-l1', courseId: 'm02', lessonId: 'm02-l1', firstVisitedAt: '2026-10-21T10:00:00.000Z', lastVisitedAt: '2026-10-21T10:00:00.000Z' })
    v1.close()
    const old = openDb(name)
    await old.open()
    expect(old.verno).toBe(2)
    expect(await old.lessonProgress.get('m02/m02-l1')).toMatchObject({ firstVisitedAt: '2026-10-21T10:00:00.000Z' })
    expect(await old.reports.count()).toBe(0)
    // Y la versión nueva sigue escribiendo con normalidad.
    await recordCheckAnswer(old, { courseId: 'm02', lessonId: 'm02-l1', purpose: 'checks', contentVersion: '0.1.0', size: 1 }, null, makeQuestion({ id: 'm02-l1-c1', use: 'check' }), ['k1', 'd1', 'd2'], 'k1')
    expect((await old.lessonProgress.get('m02/m02-l1'))?.lastCheck).toMatchObject({ correct: 1, total: 1 })
    await old.delete()
  })
})

// Perfil, entrega de práctica, reportes y migración de la base (fake-indexeddb).
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Practice } from '../domain/content'
import { openDb, type LearnerDb } from './db'
import { getProfile, getSubmission, listReports, saveProfile, saveReport, saveSubmission } from './learner'
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
  rubric: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }],
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

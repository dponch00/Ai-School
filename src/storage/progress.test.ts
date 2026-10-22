// Persistencia del progreso con una IndexedDB en memoria (fake-indexeddb).
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { makeQuestion } from '../domain/fixtures.test-utils'
import { Attempt, Backup, Response, SCHEMA_VERSION, responseIssues } from '../domain/learner'
import { openDb, type LearnerDb } from './db'
import { type CheckRound, lessonProgress, markLessonVisited, recordCheckAnswer, scoreRound } from './progress'

let db: LearnerDb
let n = 0
beforeEach(() => {
  db = openDb(`ai-school-test-${++n}`)
})
afterEach(async () => {
  await db.delete()
})

const q1 = makeQuestion({ id: 'm02-l1-c1', use: 'check' })
const q2 = makeQuestion({ id: 'm02-l1-c2', use: 'check' })
const round: CheckRound = { courseId: 'm02', lessonId: 'm02-l1', purpose: 'checks', contentVersion: '0.1.0', size: 2 }
const shown = ['d2', 'k1', 'd1']

describe('progreso de lectura', () => {
  it('la primera visita fija firstVisitedAt y las siguientes solo actualizan lastVisitedAt', async () => {
    await markLessonVisited(db, 'm02', 'm02-l1', '2026-10-22T10:00:00.000Z')
    await markLessonVisited(db, 'm02', 'm02-l1', '2026-10-23T10:00:00.000Z')
    const p = await lessonProgress(db, 'm02', 'm02-l1')
    expect(p).toMatchObject({ firstVisitedAt: '2026-10-22T10:00:00.000Z', lastVisitedAt: '2026-10-23T10:00:00.000Z' })
    expect(p?.checksCompletedAt).toBeUndefined()
  })
})

describe('comprobaciones', () => {
  it('la primera respuesta crea un intento en curso con la pregunta congelada y el orden mostrado', async () => {
    const id = await recordCheckAnswer(db, round, null, q1, shown, 'd1')
    const a = Attempt.parse(await db.attempts.get(id))
    expect(a).toMatchObject({ kind: 'check', status: 'in-progress', formLabel: 'comprobaciones m02-l1', isFirstAttempt: true })
    expect(a.items[0].shownOptionIds).toEqual(shown)
    const [r] = await db.responses.where('attemptId').equals(id).toArray()
    expect(Response.parse(r)).toMatchObject({ questionId: 'm02-l1-c1', firstSelectedOptionId: 'd1', status: 'submitted' })
  })

  it('al responder toda la ronda el intento se envía y la lección guarda el resultado', async () => {
    const id = await recordCheckAnswer(db, round, null, q1, shown, 'd1')
    expect(await recordCheckAnswer(db, round, id, q2, shown, 'k1')).toBe(id)
    const a = Attempt.parse(await db.attempts.get(id))
    expect(a.status).toBe('submitted')
    expect(responseIssues(a, await db.responses.toArray())).toEqual([])
    expect(await scoreRound(db, a)).toEqual({ correct: 1, total: 2 })
    expect((await lessonProgress(db, 'm02', 'm02-l1'))?.lastCheck).toMatchObject({ correct: 1, total: 2 })
  })

  it('responder dos veces la misma pregunta en la misma ronda no duplica nada', async () => {
    const id = await recordCheckAnswer(db, round, null, q1, shown, 'd1')
    await recordCheckAnswer(db, round, id, q1, shown, 'k1')
    expect((await db.attempts.get(id))?.items).toHaveLength(1)
    expect(await db.responses.count()).toBe(1)
  })

  it('una segunda ronda es un intento nuevo que no es el primero, y checksCompletedAt no cambia', async () => {
    const first = await recordCheckAnswer(db, round, null, q1, shown, 'k1', {}, '2026-10-22T10:00:00.000Z')
    await recordCheckAnswer(db, round, first, q2, shown, 'k1', {}, '2026-10-22T10:01:00.000Z')
    const second = await recordCheckAnswer(db, round, null, q1, shown, 'd2', {}, '2026-10-24T10:00:00.000Z')
    await recordCheckAnswer(db, round, second, q2, shown, 'k1', {}, '2026-10-24T10:01:00.000Z')
    expect(second).not.toBe(first)
    expect((await db.attempts.get(second))?.isFirstAttempt).toBe(false)
    const p = await lessonProgress(db, 'm02', 'm02-l1')
    expect(p?.checksCompletedAt).toBe('2026-10-22T10:01:00.000Z')
    expect(p?.lastCheck).toEqual({ correct: 1, total: 2, at: '2026-10-24T10:01:00.000Z' })
  })

  it('el repaso se guarda como intento propio y no marca la lección como completada', async () => {
    const review: CheckRound = { ...round, lessonId: 'm02-l2', purpose: 'review', size: 1 }
    const id = await recordCheckAnswer(db, review, null, q1, shown, 'k1')
    expect((await db.attempts.get(id))?.formLabel).toBe('repaso m02-l2')
    expect((await lessonProgress(db, 'm02', 'm02-l2'))?.checksCompletedAt).toBeUndefined()
  })

  it('lo guardado cabe en un respaldo válido', async () => {
    const id = await recordCheckAnswer(db, round, null, q1, shown, 'd1')
    await recordCheckAnswer(db, round, id, q2, shown, 'k1')
    const backup = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appVersion: '0.1.0',
      contentVersions: { m02: '0.1.0' },
      profile: { localId: 'local-profile-1', updatedAt: new Date().toISOString(), declared: {} },
      attempts: await db.attempts.toArray(),
      responses: await db.responses.toArray(),
      practiceSubmissions: [],
      feedback: [],
      adjustments: [],
      notes: [],
      bookmarks: [],
      lessonProgress: await db.lessonProgress.toArray(),
    }
    expect(() => Backup.parse(backup)).not.toThrow()
  })
})

/**
 * Base local del alumno en IndexedDB (plan §9). Todo se valida con los contratos de
 * `domain/learner.ts` antes de escribirse: la base nunca guarda algo que el respaldo no acepte.
 *
 * Migraciones: cada cambio de esquema sube SCHEMA_VERSION y añade aquí un `.version(n)`
 * con su `.upgrade()`; las versiones anteriores no se borran (Dexie las necesita para migrar).
 */
import Dexie, { type EntityTable } from 'dexie'
import {
  SCHEMA_VERSION,
  type Attempt,
  type ExternalFeedback,
  type LessonProgress,
  type PlanAdjustment,
  type PracticeSubmission,
  type Profile,
  type Response,
} from '../domain/learner'

export interface Note {
  id: string
  targetId: string
  text: string
  updatedAt: string
}

export interface Bookmark {
  id: string
  targetId: string
  createdAt: string
}

export type LearnerDb = Dexie & {
  profile: EntityTable<Profile, 'localId'>
  attempts: EntityTable<Attempt, 'id'>
  responses: EntityTable<Response, 'id'>
  practiceSubmissions: EntityTable<PracticeSubmission, 'id'>
  feedback: EntityTable<ExternalFeedback, 'id'>
  adjustments: EntityTable<PlanAdjustment, 'id'>
  notes: EntityTable<Note, 'id'>
  bookmarks: EntityTable<Bookmark, 'id'>
  lessonProgress: EntityTable<LessonProgress, 'key'>
}

export const DB_NAME = 'ai-school'

export function openDb(name = DB_NAME): LearnerDb {
  const db = new Dexie(name) as LearnerDb
  db.version(SCHEMA_VERSION).stores({
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
  return db
}

/** Instancia de la app. Las pruebas abren la suya con otro nombre. */
export const db = openDb()

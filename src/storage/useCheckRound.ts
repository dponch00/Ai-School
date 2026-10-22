import { useCallback, useEffect, useRef } from 'react'
import type { Question } from '../domain/content'
import { db } from './db'
import { type CheckRound, recordCheckAnswer } from './progress'

/**
 * Registra las respuestas de una ronda durante una visita. Cada visita empieza una ronda nueva,
 * así el repaso vuelve a ser práctica de recuperación y no una lista de respuestas ya vistas.
 */
export function useCheckRound(round: CheckRound) {
  const attemptId = useRef<string | null>(null)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const { courseId, lessonId, purpose, contentVersion, size } = round

  useEffect(() => {
    attemptId.current = null
  }, [courseId, lessonId, purpose])

  return useCallback(
    (question: Question, shownOptionIds: string[], selectedOptionId: string) => {
      // En serie: dos respuestas rápidas no deben crear dos intentos.
      queue.current = queue.current
        .then(() => recordCheckAnswer(db, { courseId, lessonId, purpose, contentVersion, size }, attemptId.current, question, shownOptionIds, selectedOptionId))
        .then((id) => {
          attemptId.current = id
        })
        .catch((e) => console.warn('No se pudo guardar la respuesta', e))
    },
    [courseId, lessonId, purpose, contentVersion, size],
  )
}

export function routeHint(kind: 'lesson' | 'lab', currentLesson: number, lessonCount: number) {
  if (kind === 'lab') return 'Después del laboratorio sigue el examen.'
  const left = Math.max(0, lessonCount - currentLesson)
  if (left === 0) return 'Después de esta lección sigue el laboratorio y luego el examen.'
  return `Faltan ${left} ${left === 1 ? 'lección' : 'lecciones'} y el laboratorio para el examen.`
}

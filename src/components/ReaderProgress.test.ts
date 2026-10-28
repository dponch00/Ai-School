import { describe, expect, it } from 'vitest'
import { routeHint } from './readingRoute'

describe('ruta del lector', () => {
  it('indica lo que queda antes del examen desde una lección', () => {
    expect(routeHint('lesson', 1, 6)).toBe('Faltan 5 lecciones y el laboratorio para el examen.')
  })

  it('nombra el laboratorio y el examen al cerrar las lecciones', () => {
    expect(routeHint('lesson', 6, 6)).toBe('Después de esta lección sigue el laboratorio y luego el examen.')
  })

  it('muestra que el examen sigue al laboratorio', () => {
    expect(routeHint('lab', 0, 6)).toBe('Después del laboratorio sigue el examen.')
  })
})

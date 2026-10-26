// Anclaje de subrayados por cita (función pura).
import { describe, expect, it } from 'vitest'
import { findQuote, quoteAt } from './highlighting'

describe('anclaje por cita', () => {
  const text = 'La regla vale. Un check pasa o falla. Un check que pasa por la razón equivocada no prueba nada.'

  it('encuentra una cita única', () => {
    const at = findQuote(text, { quote: 'razón equivocada', prefix: '', suffix: '' })
    expect(text.slice(at!.start, at!.end)).toBe('razón equivocada')
  })

  it('con dos ocurrencias, elige la del contexto guardado', () => {
    const start = text.lastIndexOf('Un check')
    const sel = quoteAt(text, start, start + 'Un check'.length)
    expect(findQuote(text, sel)!.start).toBe(start)
    const first = text.indexOf('Un check')
    expect(findQuote(text, quoteAt(text, first, first + 8))!.start).toBe(first)
  })

  it('sigue encontrando la cita si el párrafo cambió alrededor', () => {
    const start = text.indexOf('razón equivocada')
    const sel = quoteAt(text, start, start + 'razón equivocada'.length)
    const edited = 'Nueva frase al principio. ' + text.replace('no prueba nada', 'no prueba lo pedido')
    const at = findQuote(edited, sel)
    expect(edited.slice(at!.start, at!.end)).toBe('razón equivocada')
  })

  it('si dos ocurrencias empatan en contexto, elige la más cercana a la posición guardada', () => {
    const t = 'Uno. La regla vale aquí. Dos. La regla vale aquí. Tres.'
    const second = t.lastIndexOf('La regla vale')
    expect(findQuote(t, { quote: 'La regla vale', prefix: 'xx', suffix: 'zz', position: second })).toBeNull()
    expect(findQuote(t, { quote: 'La regla vale', prefix: '', suffix: '', position: second })!.start).toBe(second)
  })

  it('una cita corta cuyo entorno desapareció no se ancla en otra frase igual (T036-UX-02)', () => {
    const original = 'En la primera sección, un check pasa o falla. En la segunda sección, un check pasa o falla.'
    const first = original.indexOf('un check')
    const sel = { ...quoteAt(original, first, first + 'un check'.length), position: first }
    // La primera sección se reescribió entera: la única «un check» que queda tiene otro contexto.
    const edited = 'Texto nuevo sin la frase. En la segunda sección, un check pasa o falla.'
    expect(findQuote(edited, sel)).toBeNull()
    // Un cambio menor (una palabra antes de la cita) sí conserva el anclaje.
    const minor = original.replace('primera sección', 'primera parte')
    expect(findQuote(minor, sel)!.start).toBe(minor.indexOf('un check'))
  })

  it('una cita larga se reconoce aunque cambie su entorno', () => {
    const quote = 'un check que pasa por la razón equivocada no prueba nada'
    expect(findQuote(`Otro principio. ${quote}, y punto.`, { quote, prefix: 'xxxxxxxx', suffix: 'yyyyyyyy' })).not.toBeNull()
  })

  it('devuelve null si la cita ya no está', () => {
    expect(findQuote(text, { quote: 'texto que no existe', prefix: '', suffix: '' })).toBeNull()
  })
})

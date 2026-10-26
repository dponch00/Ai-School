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

  it('devuelve null si la cita ya no está', () => {
    expect(findQuote(text, { quote: 'texto que no existe', prefix: '', suffix: '' })).toBeNull()
  })
})

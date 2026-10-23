// Búsqueda sobre el contenido real compilado (src/generated/content.json, lo genera `pretest`).
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { SearchDoc } from '../content'
import { createIndex, processTerm, search, snippetOf } from './index'

const docs = JSON.parse(readFileSync(resolve(import.meta.dirname, '../generated/search.json'), 'utf8')) as SearchDoc[]
const index = createIndex(docs)
const ids = (q: string) => search(index, q).map((h) => h.id)

describe('búsqueda', () => {
  it('normaliza: minúsculas, raíz en español y sin acentos; descarta palabras vacías', () => {
    const raices = (t: string) => [processTerm(t)].flat()
    expect(raices('Especificaciones').some((r) => raices('especificación').includes(r))).toBe(true)
    expect(raices('reconciliacion').some((r) => raices('reconciliación').includes(r))).toBe(true)
    expect(processTerm('de')).toBeNull()
  })

  it('encuentra el término del glosario y el apartado de la lección que lo explica', () => {
    const hits = ids('invariante')
    expect(hits).toContain('g-invariante')
    expect(hits).toContain('m02-l3#forma-verdad')
  })

  it('tolera plurales, acentos omitidos y errores pequeños', () => {
    expect(ids('contraejemplos')).toContain('g-contraejemplo')
    expect(ids('reconciliacion')[0]).toBeDefined()
    expect(ids('especificacion autocontenida')).toContain('g-especificacion-autocontenida')
    expect(ids('evidensia')).toContain('g-evidencia')
    // T020-01: una letra de más y dos letras cambiadas de lugar
    expect(ids('invariantte')).toContain('g-invariante')
    expect(ids('invariabte')).toContain('g-invariante')
  })

  it('los resultados llevan a la lección y al apartado, al laboratorio o al glosario', () => {
    const hit = search(index, 'invariante').find((h) => h.id === 'm02-l3#forma-verdad')!
    expect(hit.href).toBe('/cursos/m02/lecciones/m02-l3?seccion=forma-verdad')
    expect(search(index, 'invariante').find((h) => h.kind === 'glossary')!.href).toBe('/glosario?termino=g-invariante')
  })

  it('el fragmento muestra la zona de la coincidencia', () => {
    const s = snippetOf('Texto largo de introducción que no importa. Aquí aparece la invariante que buscamos y algo más.', 'invariantes', 40)
    expect(s).toContain('invariante')
  })

  it('una consulta vacía o de una letra no devuelve nada', () => {
    expect(search(index, ' ')).toEqual([])
    expect(search(index, 'a')).toEqual([])
  })
})

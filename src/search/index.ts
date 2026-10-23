/**
 * Búsqueda sin conexión (F2-07, D-014): MiniSearch con el stemmer español de Orama y plegado de acentos.
 * El stemmer va antes del plegado porque Snowball espera tildes; la misma función se usa al indexar y al buscar.
 */
import { stemmer } from '@orama/stemmers/spanish'
import MiniSearch from 'minisearch'
import type { SearchDoc } from '../content'

/** Palabras vacías frecuentes: no aportan al buscar y llenan los resultados. */
const STOP = new Set(['de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'del', 'un', 'una', 'que', 'se', 'por', 'con', 'para', 'es', 'lo', 'al', 'su', 'no', 'o'])

const unaccent = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '')

/**
 * Devuelve la raíz con y sin tildes: «reconciliación» y «reconciliacion» (escrita sin tilde) deben coincidir,
 * y Snowball solo reconoce el sufijo cuando la tilde está.
 */
export function processTerm(term: string): string | string[] | null {
  const lower = term.toLowerCase()
  if (lower.length < 2 || STOP.has(lower)) return null
  const terms = [...new Set([unaccent(stemmer(lower)), unaccent(stemmer(unaccent(lower)))])]
  return terms.length === 1 ? terms[0] : terms
}

export function createIndex(docs: SearchDoc[]): MiniSearch<SearchDoc> {
  const index = new MiniSearch<SearchDoc>({
    fields: ['title', 'text'],
    storeFields: ['kind', 'courseId', 'lessonId', 'anchor', 'title', 'context', 'text'],
    processTerm,
    searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.2, processTerm },
  })
  index.addAll(docs)
  return index
}

export interface SearchHit {
  id: string
  kind: SearchDoc['kind']
  title: string
  context: string
  /** Fragmento del texto alrededor de la primera coincidencia. */
  snippet: string
  href: string
}

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

/** Fragmento de unas 160 letras alrededor de la primera palabra de la consulta que aparezca. */
export function snippetOf(text: string, query: string, size = 160): string {
  const words = query.split(/\s+/).map(fold).filter((w) => w.length > 2)
  const folded = fold(text)
  const at = words.map((w) => folded.indexOf(w.slice(0, Math.max(3, w.length - 2)))).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0
  const start = Math.max(0, at - Math.floor(size / 4))
  const piece = text.slice(start, start + size).trim()
  return `${start > 0 ? '…' : ''}${piece}${start + size < text.length ? '…' : ''}`
}

export function search(index: MiniSearch<SearchDoc>, query: string, limit = 20): SearchHit[] {
  if (query.trim().length < 2) return []
  return index
    .search(query)
    .slice(0, limit)
    .map((r) => {
      const d = r as unknown as SearchDoc & { id: string }
      const href =
        d.kind === 'glossary'
          ? `/glosario?termino=${d.id}`
          : d.kind === 'lab'
            ? `/cursos/${d.courseId}/laboratorio?seccion=${d.anchor}`
            : `/cursos/${d.courseId}/lecciones/${d.lessonId}?seccion=${d.anchor}`
      return { id: d.id, kind: d.kind, title: d.title, context: d.context, snippet: snippetOf(d.text, query), href }
    })
}

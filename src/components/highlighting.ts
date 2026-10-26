/**
 * Subrayados dentro del texto de una lección: anclaje por cita y su dibujo en el DOM.
 *
 * El texto de la lección se lee de los bloques `.prose` (el HTML que viene del Markdown). Las fichas,
 * las figuras y las preguntas son componentes de React y no se subrayan.
 */
import type { HighlightColor } from '../domain/learner'

export const HIGHLIGHT_COLORS: { id: HighlightColor; label: string }[] = [
  { id: 'amarillo', label: 'Amarillo' },
  { id: 'verde', label: 'Verde' },
  { id: 'rosa', label: 'Rosa' },
  { id: 'azul', label: 'Azul' },
]

const CONTEXT = 32
/** Una cita de este largo se reconoce sola; una más corta necesita que coincida al menos la mitad de su entorno. */
const LONG_QUOTE = 40

export interface TextQuote {
  quote: string
  prefix: string
  suffix: string
}

/** Cuántos caracteres coinciden al final de `a` y al final de `b`. */
function commonSuffix(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[a.length - 1 - i] === b[b.length - 1 - i]) i++
  return i
}

function commonPrefix(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

/**
 * Busca la cita en el texto. Si aparece más de una vez, elige la ocurrencia cuyo contexto
 * (lo de antes y lo de después) más se parece al guardado; si dos empatan, la más cercana a la
 * posición original. Devuelve null si la cita ya no está o si solo quedan coincidencias débiles:
 * una cita corta cuyo entorno cambió por completo podría ser otra frase igual en otra sección (T036-UX-02).
 */
export function findQuote(text: string, sel: TextQuote & { position?: number }): { start: number; end: number } | null {
  if (!sel.quote) return null
  const required = sel.quote.length >= LONG_QUOTE ? 0 : Math.ceil((sel.prefix.length + sel.suffix.length) / 2)
  const distance = (i: number) => (sel.position === undefined ? 0 : Math.abs(i - sel.position))
  let best: { start: number; score: number } | null = null
  for (let i = text.indexOf(sel.quote); i !== -1; i = text.indexOf(sel.quote, i + 1)) {
    const before = text.slice(Math.max(0, i - sel.prefix.length), i)
    const after = text.slice(i + sel.quote.length, i + sel.quote.length + sel.suffix.length)
    const score = commonSuffix(before, sel.prefix) + commonPrefix(after, sel.suffix)
    if (score < required) continue
    if (!best || score > best.score || (score === best.score && distance(i) < distance(best.start))) best = { start: i, score }
  }
  return best ? { start: best.start, end: best.start + sel.quote.length } : null
}

export function quoteAt(text: string, start: number, end: number): TextQuote {
  return {
    quote: text.slice(start, end),
    prefix: text.slice(Math.max(0, start - CONTEXT), start),
    suffix: text.slice(end, end + CONTEXT),
  }
}

// ---------- DOM ----------

export interface TextMap {
  text: string
  nodes: { node: Text; start: number }[]
  /** Posiciones donde empieza un bloque nuevo (párrafo, título, celda…): ahí no hay espacio en el texto, pero sí un corte. */
  breaks: Set<number>
}

const BLOCK = 'p, li, h1, h2, h3, h4, h5, h6, td, th, pre, blockquote, figcaption, dt, dd, summary, div, section, aside'


/**
 * Concatena el texto de los bloques `.prose`, sin contar los botones (de los bloques de código y de
 * las notas) ni el texto auxiliar de los subrayados para lectores de pantalla.
 */
export function textMap(root: HTMLElement): TextMap {
  const nodes: TextMap['nodes'] = []
  const breaks = new Set<number>()
  let text = ''
  let block: Element | null = null
  for (const prose of root.querySelectorAll<HTMLElement>('.prose')) {
    const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest('button, .code-block__status, [data-hl-aux]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    })
    for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
      const b = n.parentElement?.closest(BLOCK) ?? null
      if (b !== block) breaks.add(text.length)
      block = b
      nodes.push({ node: n, start: text.length })
      text += n.data
    }
    text += '\n'
  }
  return { text, nodes, breaks }
}

/** Posición en el texto concatenado de un punto (nodo, desplazamiento) de una selección. */
function offsetOf(map: TextMap, node: Node, offset: number): number | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const entry = map.nodes.find((e) => e.node === node)
    return entry ? entry.start + offset : null
  }
  // Un punto entre hijos de un elemento: se toma el primer nodo de texto que está en el punto o después.
  const point = document.createRange()
  point.setStart(node, offset)
  point.collapse(true)
  const after = map.nodes.find((e) => point.comparePoint(e.node, 0) >= 0)
  return after ? after.start : map.text.length
}

/** La selección como cita, si cae entera dentro del texto subrayable de la lección. */
export function selectionQuote(root: HTMLElement, range: Range): (TextQuote & { position: number }) | null {
  const map = textMap(root)
  const start = offsetOf(map, range.startContainer, range.startOffset)
  const end = offsetOf(map, range.endContainer, range.endOffset)
  if (start === null || end === null || end <= start) return null
  const raw = map.text.slice(start, end)
  // Se recortan los espacios de los bordes para que la cita empiece y termine en texto.
  const lead = raw.length - raw.trimStart().length
  const trail = raw.length - raw.trimEnd().length
  let s = start + lead
  let e = end - trail
  // Se completan las palabras cortadas en los bordes: subrayar «ten c» guarda «ten claras». Nunca se
  // cruza a otro bloque: un título que termina en letra y el párrafo siguiente no forman una palabra.
  const isWord = (ch: string | undefined) => !!ch && /[\p{L}\p{N}]/u.test(ch)
  while (s > 0 && !map.breaks.has(s) && isWord(map.text[s - 1]) && isWord(map.text[s])) s--
  while (e < map.text.length && !map.breaks.has(e) && isWord(map.text[e]) && isWord(map.text[e - 1])) e++
  if (e - s < 2 || e - s > 2000) return null
  return { ...quoteAt(map.text, s, e), position: s }
}

/** Título y ancla del último h2 anterior al nodo dentro de la lección. */
export function sectionOf(root: HTMLElement, node: Node): { id: string | null; title: string | null } {
  let found: HTMLElement | null = null
  for (const h of root.querySelectorAll<HTMLElement>('.prose h2[id]')) {
    if (h === node || h.contains(node) || h.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) found = h
  }
  return { id: found?.id ?? null, title: found?.textContent?.trim().slice(0, 200) ?? null }
}

/** Quita todas las marcas (y su texto auxiliar) y deja el texto como estaba. */
export function clearMarks(root: HTMLElement) {
  for (const aux of root.querySelectorAll('[data-hl-aux]')) aux.remove()
  for (const mark of root.querySelectorAll('mark[data-hl-id]')) {
    const parent = mark.parentNode
    if (!parent) continue
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  }
}

/** Tramo [start, end) que ocupa en el texto cada subrayado ya dibujado. */
export function drawnRanges(map: TextMap): Map<string, { start: number; end: number }> {
  const ranges = new Map<string, { start: number; end: number }>()
  for (const { node, start } of map.nodes) {
    const end = start + node.data.length
    for (let el = node.parentElement?.closest<HTMLElement>('mark[data-hl-id]'); el; el = el.parentElement?.closest<HTMLElement>('mark[data-hl-id]')) {
      const id = el.dataset.hlId!
      const r = ranges.get(id)
      ranges.set(id, r ? { start: Math.min(r.start, start), end: Math.max(r.end, end) } : { start, end })
    }
  }
  return ranges
}

function aux(tag: 'span' | 'button', text: string): HTMLElement {
  const el = document.createElement(tag)
  el.dataset.hlAux = ''
  el.textContent = text
  return el
}

/**
 * Envuelve en marcas el tramo [start, end) del texto, aunque cruce varios elementos. Un lector de
 * pantalla oye dónde empieza y dónde termina el subrayado, y su color; si tiene nota, el final es un
 * botón ✎ que abre el editor (T036-A11Y-03).
 */
function wrap(map: TextMap, start: number, end: number, id: string, color: HighlightColor, hasNote: boolean) {
  const marks: HTMLElement[] = []
  for (const { node, start: ns } of map.nodes) {
    const ne = ns + node.data.length
    if (ne <= start || ns >= end) continue
    const from = Math.max(start, ns) - ns
    const to = Math.min(end, ne) - ns
    let target = node
    if (to < target.data.length) target.splitText(to)
    if (from > 0) target = target.splitText(from)
    const mark = document.createElement('mark')
    mark.className = `hl hl--${color}`
    mark.dataset.hlId = id
    target.parentNode!.insertBefore(mark, target)
    mark.appendChild(target)
    marks.push(mark)
  }
  if (marks.length === 0) return
  const label = HIGHLIGHT_COLORS.find((c) => c.id === color)?.label.toLowerCase() ?? color
  const open = aux('span', `Subrayado en ${label}${hasNote ? ', con nota' : ''}: `)
  open.className = 'visually-hidden'
  marks[0].prepend(open)
  const last = marks[marks.length - 1]
  if (hasNote) {
    const button = aux('button', '✎') as HTMLButtonElement
    button.type = 'button'
    button.className = 'hl-note'
    button.dataset.hlId = id
    button.setAttribute('aria-label', 'Ver o editar la nota de este subrayado')
    last.after(button)
  } else {
    const close = aux('span', ' (fin del subrayado)')
    close.className = 'visually-hidden'
    last.after(close)
  }
}

export interface Drawable extends TextQuote {
  id: string
  position?: number
  color: HighlightColor
  note?: string
}

/** Dibuja los subrayados; devuelve los IDs de los que ya no se encuentran en el texto. */
export function drawHighlights(root: HTMLElement, list: Drawable[]): string[] {
  clearMarks(root)
  const missing: string[] = []
  for (const h of list) {
    // El mapa se recalcula en cada uno porque envolver parte los nodos de texto.
    const map = textMap(root)
    const at = findQuote(map.text, h)
    if (!at) {
      missing.push(h.id)
      continue
    }
    wrap(map, at.start, at.end, h.id, h.color, !!h.note)
  }
  return missing
}

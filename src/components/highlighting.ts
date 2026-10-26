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
 * (lo de antes y lo de después) más se parece al guardado. Devuelve null si la cita ya no está.
 */
export function findQuote(text: string, sel: TextQuote): { start: number; end: number } | null {
  if (!sel.quote) return null
  let best: { start: number; score: number } | null = null
  for (let i = text.indexOf(sel.quote); i !== -1; i = text.indexOf(sel.quote, i + 1)) {
    const before = text.slice(Math.max(0, i - sel.prefix.length), i)
    const after = text.slice(i + sel.quote.length, i + sel.quote.length + sel.suffix.length)
    const score = commonSuffix(before, sel.prefix) + commonPrefix(after, sel.suffix)
    if (!best || score > best.score) best = { start: i, score }
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

interface TextMap {
  text: string
  nodes: { node: Text; start: number }[]
}

/** Concatena el texto de los bloques `.prose`, sin contar los botones de los bloques de código. */
export function textMap(root: HTMLElement): TextMap {
  const nodes: TextMap['nodes'] = []
  let text = ''
  for (const prose of root.querySelectorAll<HTMLElement>('.prose')) {
    const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest('button, .code-block__status') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    })
    for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
      nodes.push({ node: n, start: text.length })
      text += n.data
    }
    text += '\n'
  }
  return { text, nodes }
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
  // Se completan las palabras cortadas en los bordes: subrayar «ten c» guarda «ten claras».
  const isWord = (ch: string | undefined) => !!ch && /[\p{L}\p{N}]/u.test(ch)
  while (s > 0 && isWord(map.text[s - 1]) && isWord(map.text[s])) s--
  while (e < map.text.length && isWord(map.text[e]) && isWord(map.text[e - 1])) e++
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

/** Quita todas las marcas y deja el texto como estaba. */
export function clearMarks(root: HTMLElement) {
  for (const mark of root.querySelectorAll('mark[data-hl-id]')) {
    const parent = mark.parentNode
    if (!parent) continue
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  }
}

/** Envuelve en marcas el tramo [start, end) del texto, aunque cruce varios elementos. */
function wrap(map: TextMap, start: number, end: number, id: string, color: HighlightColor, hasNote: boolean) {
  let first = true
  for (const { node, start: ns } of map.nodes) {
    const ne = ns + node.data.length
    if (ne <= start || ns >= end) continue
    const from = Math.max(start, ns) - ns
    const to = Math.min(end, ne) - ns
    let target = node
    if (to < target.data.length) target.splitText(to)
    if (from > 0) target = target.splitText(from)
    const mark = document.createElement('mark')
    mark.className = `hl hl--${color}${hasNote && first ? ' hl--note' : ''}`
    mark.dataset.hlId = id
    target.parentNode!.insertBefore(mark, target)
    mark.appendChild(target)
    first = false
  }
}

export interface Drawable extends TextQuote {
  id: string
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

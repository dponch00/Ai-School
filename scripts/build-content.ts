/**
 * Pipeline de contenido (F1-02): valida content/ contra los contratos y genera
 * src/generated/content.json, src/generated/tokens.css y public/generated/ (diagramas).
 *
 * Se ejecuta con `node scripts/build-content.ts` (Node 24 elimina los tipos al vuelo)
 * y corre antes de `dev`, `build` y `test`. Si algo no cumple el contrato, el build falla.
 */
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Element, ElementContent, Root as HastRoot } from 'hast'
import { toHtml } from 'hast-util-to-html'
import type { Root as MdastRoot } from 'mdast'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { Asset, Competency, Course, DiagnosticForm, GlossaryTerm, Lesson, Misconception, Practice, ProductCard, Question, Source } from '../src/domain/content.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = resolve(root, 'content')
const readJson = (p: string) => JSON.parse(readFileSync(resolve(contentDir, p), 'utf8'))
/** `--check`: valida todo sin escribir archivos (para revisar contenido mientras otros arman). */
const CHECK = process.argv.includes('--check')
const write = (path: string, data: string) => void (CHECK || writeFileSync(path, data))

// ---------- Markdown → bloques ----------

type Block =
  | { type: 'html'; html: string }
  | { type: 'product-card'; id: string }
  | { type: 'figure'; id: string }
  | { type: 'check-questions' }
  | { type: 'lab-questions'; id: string }

interface Rendered {
  blocks: Block[]
  toc: { id: string; text: string }[]
  citations: string[]
  /** Términos del glosario (`:term`) y relaciones con otros manuales o lecciones (`:ref`), para validarlos. */
  terms: string[]
  refs: string[]
}

/** Destino de `:ref[…]{to=…}`: un manual (`m07`), una lección (`m07-l1`) o un apartado (`m07-l1#contrato`). */
const REF_TARGET = /^(m\d{2})(?:-(l\d)(?:#([a-z0-9-]+))?)?$/
function refHref(to: string): string {
  const [, courseId, lessonPart, anchor] = to.match(REF_TARGET)!
  if (!lessonPart) return `#/cursos/${courseId}`
  return `#/cursos/${courseId}/lecciones/${courseId}-${lessonPart}${anchor ? `?seccion=${anchor}` : ''}`
}

const CONTAINERS: Record<string, { tag: string; className: string; label?: string }> = {
  decision: { tag: 'section', className: 'lesson-decision', label: 'La decisión' },
  'quick-check': { tag: 'details', className: 'quick-check', label: 'Comprobación rápida (opcional)' },
  'worked-example': { tag: 'section', className: 'worked-example' },
  'self-explain': { tag: 'section', className: 'self-explain', label: 'Explícalo con tus palabras' },
  complete: { tag: 'section', className: 'complete-example' },
  'model-answer': { tag: 'details', className: 'model-answer', label: 'Ver respuesta modelo' },
  aside: { tag: 'aside', className: 'lesson-aside', label: 'Aparte' },
  summary: { tag: 'section', className: 'lesson-summary', label: 'Resumen' },
  reveal: { tag: 'details', className: 'reveal' },
}
const LEAVES = new Set(['product-card', 'figure', 'check-questions', 'lab-questions'])

function lessonPlugin(state: { citations: string[]; toc: { id: string; text: string }[]; terms: string[]; refs: string[]; file: string }) {
  return () => (tree: MdastRoot) => {
    visit(tree, (node: any, index, parent: any) => {
      if (node.type === 'heading') {
        const last = node.children[node.children.length - 1]
        const m = last?.type === 'text' ? last.value.match(/\s*\{#([a-z0-9-]+)\}\s*$/) : null
        if (m) {
          last.value = last.value.slice(0, m.index)
          node.data = { ...node.data, hProperties: { id: m[1] } }
          if (node.depth === 2) state.toc.push({ id: m[1], text: node.children.map((c: any) => c.value ?? '').join('').trim() })
        }
        if (node.depth === 1 && parent && typeof index === 'number') {
          parent.children.splice(index, 1) // el título lo pone la app
          return index
        }
      }
      if (node.type === 'containerDirective') {
        const spec = CONTAINERS[node.name]
        if (!spec) throw new Error(`${state.file}: directiva de contenedor desconocida «${node.name}»`)
        const title = node.attributes?.title ?? spec.label
        node.data = { hName: spec.tag, hProperties: { className: [spec.className] } }
        if (title) {
          const titleNode = spec.tag === 'details'
            ? { type: 'paragraph', data: { hName: 'summary' }, children: [{ type: 'text', value: title }] }
            : { type: 'paragraph', data: { hName: 'p', hProperties: { className: ['block-title'] } }, children: [{ type: 'text', value: title }] }
          node.children.unshift(titleNode)
        }
      }
      if (node.type === 'leafDirective') {
        if (!LEAVES.has(node.name)) throw new Error(`${state.file}: directiva desconocida «::${node.name}»`)
        const id = node.attributes?.id ?? node.attributes?.asset ?? node.attributes?.step ?? ''
        node.data = { hName: 'div', hProperties: { dataBlock: node.name, dataId: id } }
        node.children = []
      }
      if (node.type === 'text' && node.value.includes('[inferencia]') && parent && typeof index === 'number') {
        const parts = node.value.split('[inferencia]')
        const out: any[] = []
        parts.forEach((part: string, i: number) => {
          if (part) out.push({ type: 'text', value: i < parts.length - 1 ? part.replace(/\s+$/, '') : part })
          if (i < parts.length - 1)
            out.push({ type: 'emphasis', data: { hName: 'sup', hProperties: { className: ['inference'], title: 'Conclusión del curso, no de una fuente citada' } }, children: [{ type: 'text', value: '*' }] })
        })
        parent.children.splice(index, 1, ...out)
        return index + out.length
      }
      if (node.type === 'textDirective' && node.name === 'term') {
        // :term[texto]{id=g-…} abre la definición en el panel lateral; sin JavaScript lleva al glosario.
        const id = node.attributes?.id ?? ''
        if (!/^g-[a-z0-9-]+$/.test(id)) throw new Error(`${state.file}: :term sin id de glosario válido («${id}»)`)
        state.terms.push(id)
        node.data = { hName: 'a', hProperties: { className: ['term'], href: `#/glosario?termino=${id}`, dataTerm: id } }
        return
      }
      if (node.type === 'textDirective' && node.name === 'ref') {
        // :ref[texto]{to=m07-l1#contrato} abre el manual, la lección o el apartado en el panel lateral.
        const to = node.attributes?.to ?? ''
        if (!REF_TARGET.test(to)) throw new Error(`${state.file}: :ref con destino inválido («${to}»)`)
        state.refs.push(to)
        node.data = { hName: 'a', hProperties: { className: ['xref'], href: refHref(to), dataRef: to } }
        return
      }
      if (node.type === 'textDirective') {
        if (node.name !== 'cite') throw new Error(`${state.file}: directiva de texto desconocida «:${node.name}» (¿un «:» seguido de letra en el texto?)`)
        const id = node.children.map((c: any) => c.value).join('')
        if (!state.citations.includes(id)) state.citations.push(id)
        const n = state.citations.indexOf(id) + 1
        node.data = { hName: 'sup', hProperties: { className: ['cite'] } }
        node.children = [{ type: 'link', url: `#fuente-${n}`, data: { hProperties: { dataSource: id } }, children: [{ type: 'text', value: `[${n}]` }] }]
      }
    })
  }
}

const sanitizeSchema = {
  ...defaultSchema,
  clobberPrefix: '',
  clobber: [],
  tagNames: [...(defaultSchema.tagNames ?? []), 'section', 'aside', 'details', 'summary', 'sup'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'id', 'dataBlock', 'dataId', 'dataSource', 'dataTerm', 'dataRef'],
    code: [['className', /^language-./]],
    // El esquema por defecto restringe la clase de section a 'footnotes'; aquí usamos las nuestras.
    section: ['className', 'id'],
    // El esquema por defecto limita la clase de los enlaces a las notas al pie; aquí van term y xref (`:term`, `:ref`).
    a: [...(defaultSchema.attributes?.a ?? []).filter((x) => !(Array.isArray(x) && x[0] === 'className')), ['className', 'term', 'xref']],
    aside: ['className'],
    details: ['className'],
  },
}

const LANG: Record<string, string> = { bash: 'Terminal', json: 'JSON', gherkin: 'Gherkin', python: 'Python', sql: 'SQL', ts: 'TypeScript' }

/** UI-02 (T-011): cada <pre> se envuelve con etiqueta de lenguaje, foco con teclado y botón Copiar. */
/** Las tablas se desplazan en horizontal en pantallas angostas: deben poder enfocarse con el teclado (F2-08, axe). */
function rehypeFocusableTables() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'table') node.properties = { ...node.properties, tabIndex: 0 }
    })
  }
}

function rehypeCodeBlocks() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element, index, parent: any) => {
      if (node.tagName !== 'pre' || !parent || typeof index !== 'number') return
      const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code')
      const cls = ((code?.properties?.className as string[] | undefined) ?? []).find((c) => c.startsWith('language-'))
      const lang = cls ? cls.slice('language-'.length) : ''
      const label = LANG[lang] ?? (lang ? lang.toUpperCase() : 'Código')
      node.properties = { ...node.properties, tabIndex: 0, ariaLabel: `Bloque de código: ${label}. Usa las flechas para desplazarte.` }
      parent.children[index] = {
        type: 'element', tagName: 'div', properties: { className: ['code-block'] },
        children: [
          { type: 'element', tagName: 'div', properties: { className: ['code-block__bar'] }, children: [
            { type: 'element', tagName: 'span', properties: { className: ['code-block__lang'] }, children: [{ type: 'text', value: label }] },
            { type: 'element', tagName: 'button', properties: { type: 'button', className: ['code-block__copy'], dataCopy: '' }, children: [{ type: 'text', value: 'Copiar' }] },
          ] },
          node,
          { type: 'element', tagName: 'p', properties: { className: ['code-block__status'], role: 'status' }, children: [] },
        ],
      }
      return index + 1
    })
  }
}

function renderMarkdown(md: string, file: string): Rendered {
  const state = { citations: [] as string[], toc: [] as { id: string; text: string }[], terms: [] as string[], refs: [] as string[], file }
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(lessonPlugin(state))
    .use(remarkRehype)
    .use(rehypeSanitize, sanitizeSchema as any)
    .use(rehypeCodeBlocks)
    .use(rehypeFocusableTables)
  const hast = processor.runSync(processor.parse(md)) as HastRoot
  const blocks: Block[] = []
  let buffer: ElementContent[] = []
  const flush = () => {
    const html = toHtml({ type: 'root', children: buffer }).trim()
    if (html) blocks.push({ type: 'html', html })
    buffer = []
  }
  for (const child of hast.children as ElementContent[]) {
    const block = child.type === 'element' ? ((child as Element).properties?.dataBlock as string | undefined) : undefined
    if (!block) {
      buffer.push(child)
      continue
    }
    flush()
    const id = String((child as Element).properties?.dataId ?? '')
    if (block === 'check-questions') blocks.push({ type: 'check-questions' })
    else if (block === 'lab-questions') blocks.push({ type: 'lab-questions', id })
    else blocks.push({ type: block as 'product-card' | 'figure', id })
  }
  flush()
  return { blocks, toc: state.toc, citations: state.citations, terms: state.terms, refs: state.refs }
}

// ---------- Construcción ----------

const sources = new Map(Source.array().parse(readJson('sources.json')).map((s) => [s.id, s]))
const catalog: { id: string; title: string; centralQuestion: string }[] = readJson('catalog.json')
const competencies = Object.fromEntries(Competency.array().parse(readJson('competencies.json')).map((c) => [c.id, c]))
const questions: Record<string, unknown> = {}
const productCards: Record<string, unknown> = {}
const assets: Record<string, unknown> = {}
const courses: unknown[] = []
/** Dónde se usa cada `:term` y cada `:ref`, para validarlos cuando ya se conocen todas las lecciones. */
const relationUses: { file: string; lessonId: string | null; terms: string[]; refs: string[] }[] = []
/** Lo pesado de cada curso (preguntas, fichas, activos) va en su propio paquete (F2-05). */
const coursePieces = new Map<string, { questions: Record<string, unknown>; productCards: Record<string, unknown>; assets: Record<string, unknown> }>()
mkdirSync(resolve(root, 'public/generated'), { recursive: true })

const cite = (ids: string[]) =>
  ids.map((id, i) => {
    const s = sources.get(id)
    if (!s) throw new Error(`fuente inexistente: ${id}`)
    return { n: i + 1, id, title: s.title, organization: s.organization, url: s.url, accessedAt: s.accessedAt }
  })

for (const courseId of readdirSync(resolve(contentDir, 'courses'))) {
  const base = `courses/${courseId}`
  const course = Course.parse(readJson(`${base}/course.json`))
  Misconception.array().parse(readJson(`${base}/misconceptions.json`))
  const pieces = { questions: {} as Record<string, unknown>, productCards: {} as Record<string, unknown>, assets: {} as Record<string, unknown> }
  coursePieces.set(course.id, pieces)
  for (const file of ['checks', 'exam', 'practice', 'lab']) {
    const p = `${base}/questions/${file}.json`
    if (existsSync(resolve(contentDir, p))) for (const q of Question.array().parse(readJson(p))) questions[q.id] = pieces.questions[q.id] = q
  }
  if (existsSync(resolve(contentDir, `${base}/product-cards.json`)))
    for (const c of ProductCard.array().parse(readJson(`${base}/product-cards.json`))) productCards[c.id] = pieces.productCards[c.id] = c
  if (existsSync(resolve(contentDir, `${base}/assets.json`)))
    for (const a of Asset.array().parse(readJson(`${base}/assets.json`))) {
      const target = `generated/${courseId}/${a.file.split('/').pop()}`
      mkdirSync(resolve(root, 'public/generated', courseId), { recursive: true })
      if (!CHECK) copyFileSync(resolve(root, a.file), resolve(root, 'public', target))
      assets[a.id] = pieces.assets[a.id] = { ...a, url: target }
    }

  const lessons = course.lessonIds
    .filter((id) => existsSync(resolve(contentDir, `${base}/lessons/${id}.json`)))
    .map((id) => {
      const lesson = Lesson.parse(readJson(`${base}/lessons/${id}.json`))
      const rendered = renderMarkdown(readFileSync(resolve(contentDir, lesson.bodyPath), 'utf8'), lesson.bodyPath)
      relationUses.push({ file: lesson.bodyPath, lessonId: lesson.id, terms: rendered.terms, refs: rendered.refs })
      return { ...lesson, toc: rendered.toc, blocks: rendered.blocks, sources: cite(rendered.citations) }
    })

  let practice: unknown = null
  const labPath = `${base}/practice/${course.practiceId}.json`
  if (existsSync(resolve(contentDir, labPath))) {
    const lab = Practice.parse(readJson(labPath))
    const rendered = renderMarkdown(readFileSync(resolve(contentDir, lab.instructionsPath), 'utf8'), lab.instructionsPath)
    relationUses.push({ file: lab.instructionsPath, lessonId: null, terms: rendered.terms, refs: rendered.refs })
    // Caso práctico (D-024): cada pregunta existe, es de laboratorio y su paso tiene una marca ::lab-questions.
    const steps = new Set(rendered.blocks.flatMap((b) => (b.type === 'lab-questions' ? [b.id] : [])))
    for (const id of lab.questionIds) {
      const q = pieces.questions[id] as { use: string; labStep?: string } | undefined
      if (!q || q.use !== 'lab') throw new Error(`${labPath}: ${id} no es una pregunta de laboratorio`)
      if (!steps.has(q.labStep!)) throw new Error(`${labPath}: ${id} apunta al paso «${q.labStep}», que no tiene marca ::lab-questions`)
    }
    for (const step of steps)
      if (!lab.questionIds.some((id) => (pieces.questions[id] as { labStep?: string }).labStep === step))
        throw new Error(`${labPath}: el paso «${step}» no tiene preguntas`)
    practice = { ...lab, toc: rendered.toc, blocks: rendered.blocks }
  }
  // Un manual se publica completo: todas sus lecciones, su laboratorio y su banco de examen. Mientras tanto
  // se puede abrir por su enlace como «en preparación», pero no figura como disponible.
  const complete = lessons.length === course.lessonIds.length && practice !== null && Object.values(pieces.questions).some((x: any) => x.use === 'exam')
  courses.push({ ...course, lessons, practice, complete })
}

// ---------- Glosario e índice de búsqueda (F2-07) ----------
// Un archivo por manual (content/glossary/mNN.json), con los términos que ese manual explica.
const glossary = readdirSync(resolve(contentDir, 'glossary')).sort().flatMap((f) => GlossaryTerm.array().parse(readJson(`glossary/${f}`)))
for (const [i, g] of glossary.entries()) if (glossary.findIndex((x) => x.id === g.id) !== i) throw new Error(`glosario: el término ${g.id} está repetido`)
const anchorsByLesson = new Map<string, Set<string>>()
for (const c of courses as any[]) for (const l of c.lessons) anchorsByLesson.set(l.id, new Set(l.toc.map((t: { id: string }) => t.id)))
for (const g of glossary) {
  for (const ref of g.refs) {
    const [lessonId, anchor] = ref.split('#')
    if (!anchorsByLesson.get(lessonId)?.has(anchor)) throw new Error(`glosario ${g.id}: el apartado ${ref} no existe`)
  }
}
// Cada :term apunta a un término que existe y cada :ref a un manual, lección o apartado que existe.
const glossaryIds = new Set(glossary.map((g) => g.id))
const courseIds = new Set((courses as any[]).map((c) => c.id))
const usedIn = new Map<string, string[]>()
for (const use of relationUses) {
  for (const id of use.terms) {
    if (!glossaryIds.has(id)) throw new Error(`${use.file}: :term apunta a ${id}, que no está en el glosario`)
    if (use.lessonId && !usedIn.get(id)?.includes(use.lessonId)) usedIn.set(id, [...(usedIn.get(id) ?? []), use.lessonId])
  }
  for (const to of use.refs) {
    const [, courseId, lessonPart, anchor] = to.match(REF_TARGET)!
    if (!courseIds.has(courseId)) throw new Error(`${use.file}: :ref apunta al manual ${courseId}, que no existe`)
    if (lessonPart && !anchorsByLesson.has(`${courseId}-${lessonPart}`)) throw new Error(`${use.file}: :ref apunta a ${courseId}-${lessonPart}, que no existe`)
    if (anchor && !anchorsByLesson.get(`${courseId}-${lessonPart}`)!.has(anchor)) throw new Error(`${use.file}: :ref apunta a ${to}, que no existe`)
  }
}

const decode = (s: string) => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
const plain = (html: string) => decode(html.replace(/<sup class="(cite|inference)"[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

/** Un documento por apartado (cada h2), más uno por término del glosario. */
function sectionsOf(blocks: Block[]): { anchor: string; title: string; text: string }[] {
  const html = blocks.filter((b): b is Extract<Block, { type: 'html' }> => b.type === 'html').map((b) => b.html).join(' ')
  const parts = html.split(/(?=<h2 id=")/)
  return parts
    .map((p) => {
      const m = p.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>/)
      return m ? { anchor: m[1], title: plain(m[2]), text: plain(p.slice(m[0].length)) } : null
    })
    .filter((x): x is { anchor: string; title: string; text: string } => !!x && x.text.length > 0)
}
const searchDocs: { id: string; kind: 'section' | 'lab' | 'glossary'; courseId: string | null; lessonId?: string; anchor?: string; title: string; context: string; text: string }[] = []
for (const c of courses as any[]) {
  for (const l of c.lessons) {
    for (const s of sectionsOf(l.blocks)) searchDocs.push({ id: `${l.id}#${s.anchor}`, kind: 'section', courseId: c.id, lessonId: l.id, anchor: s.anchor, title: s.title, context: `${c.id.toUpperCase()} · Lección ${l.order}: ${l.title}`, text: s.text })
  }
  if (c.practice) for (const s of sectionsOf(c.practice.blocks)) searchDocs.push({ id: `${c.id}-lab#${s.anchor}`, kind: 'lab', courseId: c.id, anchor: s.anchor, title: s.title, context: `${c.id.toUpperCase()} · Laboratorio`, text: s.text })
}
for (const g of glossary) searchDocs.push({ id: g.id, kind: 'glossary', courseId: null, title: g.term, context: 'Glosario', text: `${g.en ?? ''} ${g.definition}`.trim() })

// ---------- Diagnóstico inicial (F2-06, D-015) ----------
const diagnosticForm = DiagnosticForm.parse(readJson('diagnostic/form.json'))
for (const q of Question.array().parse(readJson('diagnostic/items.json'))) questions[q.id] = q
const diagnostic = { form: diagnosticForm }

// ---------- Paquetes por curso (F2-05) ----------
// El paquete principal lleva el índice de cada curso (lecciones, objetivos, rúbrica); lo pesado va en
// public/courses/<curso>.<hash>.json, con verificación de integridad (SRI) y caché propia en el SW.
const coursesDir = resolve(root, 'public/courses')
if (!CHECK) rmSync(coursesDir, { recursive: true, force: true })
mkdirSync(coursesDir, { recursive: true })
const outlines = (courses as any[]).map((c) => {
  const pieces = coursePieces.get(c.id)!
  const pkg = {
    id: c.id,
    version: c.version,
    lessons: Object.fromEntries(c.lessons.map((l: any) => [l.id, { blocks: l.blocks, sources: l.sources }])),
    practiceBlocks: c.practice ? c.practice.blocks : null,
    questions: pieces.questions,
    productCards: pieces.productCards,
    assets: pieces.assets,
  }
  const body = JSON.stringify(pkg)
  const name = `${c.id}.${createHash('sha256').update(body).digest('hex').slice(0, 10)}.json`
  write(resolve(coursesDir, name), body)
  const integrity = `sha384-${createHash('sha384').update(body).digest('base64')}`
  return {
    ...c,
    lessons: c.lessons.map(({ blocks: _b, sources: _s, ...l }: any) => l),
    practice: c.practice ? (({ blocks: _b, ...p }: any) => p)(c.practice) : null,
    package: { url: `/courses/${name}`, integrity, bytes: Buffer.byteLength(body) },
  }
})
const diagnosticQuestions = Object.fromEntries(Object.entries(questions).filter(([id]) => id.startsWith('dx-')))

const out = {
  generatedAt: new Date().toISOString(),
  catalog: catalog.map((c) => ({ ...c, available: courses.some((x: any) => x.id === c.id && x.complete) })),
  courses: outlines,
  competencies,
  diagnostic,
  // `usedIn`: lecciones que marcan el término con :term (panel lateral, «También aparece en»).
  glossary: glossary.map((g) => ({ ...g, usedIn: usedIn.get(g.id) ?? [] })),
  // Solo las del diagnóstico: las de cada curso viajan en su paquete.
  questions: diagnosticQuestions,
  // Datos mínimos de cada fuente para las fichas de producto (que citan fuentes fuera de la lección).
  sources: Object.fromEntries([...sources.values()].map((s) => [s.id, { id: s.id, title: s.title, organization: s.organization, url: s.url, accessedAt: s.accessedAt }])),
}
mkdirSync(resolve(root, 'src/generated'), { recursive: true })
write(resolve(root, 'src/generated/content.json'), JSON.stringify(out))
// El índice de búsqueda solo lo usa la pantalla de búsqueda: va aparte y se carga al abrirla.
write(resolve(root, 'src/generated/search.json'), JSON.stringify(searchDocs))

// ---------- Tokens de diseño → variables CSS ----------
const tokens = JSON.parse(readFileSync(resolve(root, 'design/tokens.json'), 'utf8'))
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const lines: string[] = []
for (const group of ['color', 'font', 'fontSize', 'lineHeight', 'space', 'radius', 'shadow', 'layout']) {
  for (const [name, def] of Object.entries(tokens[group] as Record<string, { value: string }>))
    lines.push(`  --ais-${kebab(group)}-${kebab(name)}: ${def.value};`)
}
write(resolve(root, 'src/generated/tokens.css'), `/* Generado desde design/tokens.json. No editar. */\n:root {\n${lines.join('\n')}\n}\n`)

const lessonCount = (courses as any[]).reduce((n, c) => n + c.lessons.length, 0)
console.log(`contenido: ${courses.length} curso(s), ${lessonCount} lecciones, ${Object.keys(questions).length} preguntas, ${Object.keys(productCards).length} fichas`)

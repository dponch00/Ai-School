/**
 * Pipeline de contenido (F1-02): valida content/ contra los contratos y genera
 * src/generated/content.json, src/generated/tokens.css y public/generated/ (diagramas).
 *
 * Se ejecuta con `node scripts/build-content.ts` (Node 24 elimina los tipos al vuelo)
 * y corre antes de `dev`, `build` y `test`. Si algo no cumple el contrato, el build falla.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
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
import { Asset, Course, Lesson, Misconception, Practice, ProductCard, Question, Source } from '../src/domain/content.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = resolve(root, 'content')
const readJson = (p: string) => JSON.parse(readFileSync(resolve(contentDir, p), 'utf8'))

// ---------- Markdown → bloques ----------

type Block =
  | { type: 'html'; html: string }
  | { type: 'product-card'; id: string }
  | { type: 'figure'; id: string }
  | { type: 'check-questions' }

interface Rendered {
  blocks: Block[]
  toc: { id: string; text: string }[]
  citations: string[]
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
const LEAVES = new Set(['product-card', 'figure', 'check-questions'])

function lessonPlugin(state: { citations: string[]; toc: { id: string; text: string }[]; file: string }) {
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
        const id = node.attributes?.id ?? node.attributes?.asset ?? ''
        node.data = { hName: 'div', hProperties: { dataBlock: node.name, dataId: id } }
        node.children = []
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
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'id', 'dataBlock', 'dataId', 'dataSource'],
    code: [['className', /^language-./]],
    // El esquema por defecto restringe la clase de section a 'footnotes'; aquí usamos las nuestras.
    section: ['className', 'id'],
    aside: ['className'],
    details: ['className'],
  },
}

function renderMarkdown(md: string, file: string): Rendered {
  const state = { citations: [] as string[], toc: [] as { id: string; text: string }[], file }
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(lessonPlugin(state))
    .use(remarkRehype)
    .use(rehypeSanitize, sanitizeSchema as any)
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
    else blocks.push({ type: block as 'product-card' | 'figure', id })
  }
  flush()
  return { blocks, toc: state.toc, citations: state.citations }
}

// ---------- Construcción ----------

const sources = new Map(Source.array().parse(readJson('sources.json')).map((s) => [s.id, s]))
const catalog: { id: string; title: string; centralQuestion: string }[] = readJson('catalog.json')
const questions: Record<string, unknown> = {}
const productCards: Record<string, unknown> = {}
const assets: Record<string, unknown> = {}
const courses: unknown[] = []
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
  for (const file of ['checks', 'exam', 'practice']) {
    const p = `${base}/questions/${file}.json`
    if (existsSync(resolve(contentDir, p))) for (const q of Question.array().parse(readJson(p))) questions[q.id] = q
  }
  if (existsSync(resolve(contentDir, `${base}/product-cards.json`)))
    for (const c of ProductCard.array().parse(readJson(`${base}/product-cards.json`))) productCards[c.id] = c
  if (existsSync(resolve(contentDir, `${base}/assets.json`)))
    for (const a of Asset.array().parse(readJson(`${base}/assets.json`))) {
      const target = `generated/${courseId}/${a.file.split('/').pop()}`
      mkdirSync(resolve(root, 'public/generated', courseId), { recursive: true })
      copyFileSync(resolve(root, a.file), resolve(root, 'public', target))
      assets[a.id] = { ...a, url: target }
    }

  const lessons = course.lessonIds
    .filter((id) => existsSync(resolve(contentDir, `${base}/lessons/${id}.json`)))
    .map((id) => {
      const lesson = Lesson.parse(readJson(`${base}/lessons/${id}.json`))
      const rendered = renderMarkdown(readFileSync(resolve(contentDir, lesson.bodyPath), 'utf8'), lesson.bodyPath)
      return { ...lesson, toc: rendered.toc, blocks: rendered.blocks, sources: cite(rendered.citations) }
    })

  let practice: unknown = null
  const labPath = `${base}/practice/${course.practiceId}.json`
  if (existsSync(resolve(contentDir, labPath))) {
    const lab = Practice.parse(readJson(labPath))
    const rendered = renderMarkdown(readFileSync(resolve(contentDir, lab.instructionsPath), 'utf8'), lab.instructionsPath)
    practice = { ...lab, toc: rendered.toc, blocks: rendered.blocks }
  }
  courses.push({ ...course, lessons, practice })
}

const out = {
  generatedAt: new Date().toISOString(),
  catalog: catalog.map((c) => ({ ...c, available: courses.some((x: any) => x.id === c.id) })),
  courses,
  questions,
  productCards,
  assets,
  // Datos mínimos de cada fuente para las fichas de producto (que citan fuentes fuera de la lección).
  sources: Object.fromEntries([...sources.values()].map((s) => [s.id, { id: s.id, title: s.title, organization: s.organization, url: s.url }])),
}
mkdirSync(resolve(root, 'src/generated'), { recursive: true })
writeFileSync(resolve(root, 'src/generated/content.json'), JSON.stringify(out))

// ---------- Tokens de diseño → variables CSS ----------
const tokens = JSON.parse(readFileSync(resolve(root, 'design/tokens.json'), 'utf8'))
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const lines: string[] = []
for (const group of ['color', 'font', 'fontSize', 'lineHeight', 'space', 'radius', 'shadow', 'layout']) {
  for (const [name, def] of Object.entries(tokens[group] as Record<string, { value: string }>))
    lines.push(`  --ais-${kebab(group)}-${kebab(name)}: ${def.value};`)
}
writeFileSync(resolve(root, 'src/generated/tokens.css'), `/* Generado desde design/tokens.json. No editar. */\n:root {\n${lines.join('\n')}\n}\n`)

const lessonCount = (courses as any[]).reduce((n, c) => n + c.lessons.length, 0)
console.log(`contenido: ${courses.length} curso(s), ${lessonCount} lecciones, ${Object.keys(questions).length} preguntas, ${Object.keys(productCards).length} fichas`)

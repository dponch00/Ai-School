// Valida los archivos de content/ y design/ contra los contratos y las reglas del estándar que se pueden automatizar.
// Las reglas de juicio (plausibilidad, ausencia de pistas semánticas) quedan para la revisión de Codex.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Asset, Competency, Course, DiagnosticForm, Misconception, Question, Source } from './content'

const root = resolve(import.meta.dirname, '../..')
const read = (p: string) => JSON.parse(readFileSync(resolve(root, 'content', p), 'utf8'))

describe('content/diagnostic', () => {
  const items = Question.array().parse(read('diagnostic/items.json'))
  const misconceptions = Misconception.array().parse(read('diagnostic/misconceptions.json'))
  const form = DiagnosticForm.parse(read('diagnostic/form.json'))
  const byId = new Map(items.map((q) => [q.id, q]))

  it('el formulario apunta a ítems existentes, sin repetir', () => {
    expect(new Set(form.itemIds).size).toBe(24)
    for (const id of form.itemIds) expect(byId.has(id), id).toBe(true)
  })

  it('cada bloque tiene 4 ítems: 2 de base y 2 avanzados (curriculum §2.1)', () => {
    for (const block of form.blocks) {
      const inBlock = form.itemIds.map((id) => byId.get(id)!).filter((q) => q.diagnosticBlock === block.id)
      expect(inBlock, block.id).toHaveLength(4)
      expect(inBlock.filter((q) => q.difficulty === 'base'), block.id).toHaveLength(2)
    }
  })

  it('cada competencia de un bloque aparece en al menos un ítem del bloque', () => {
    for (const block of form.blocks) {
      const covered = new Set(items.filter((q) => q.diagnosticBlock === block.id).flatMap((q) => q.competencyIds))
      for (const c of block.competencyIds) expect(covered.has(c), `${block.id} ${c}`).toBe(true)
    }
  })

  it('cada distractor apunta a un concepto erróneo del catálogo', () => {
    const known = new Set(misconceptions.map((m) => m.id))
    for (const q of items) for (const o of q.options) if (o.misconceptionId) expect(known.has(o.misconceptionId), `${q.id}/${o.id}`).toBe(true)
  })

  it('la opción correcta no es claramente la más larga (R-C1-5)', () => {
    const offenders = items
      .map((q) => {
        const key = q.options.find((o) => o.correct)!
        const longestOther = Math.max(...q.options.filter((o) => !o.correct).map((o) => o.text.length))
        return { id: q.id, key: key.text.length, other: longestOther }
      })
      .filter((r) => r.key > r.other * 1.15)
    expect(offenders).toEqual([])
  })

  it('toda fuente citada existe en content/sources.json (DX-01)', () => {
    const sources = new Set(Source.array().parse(read('sources.json')).map((x) => x.id))
    for (const q of items) for (const id of q.sourceIds) expect(sources.has(id), `${q.id} → ${id}`).toBe(true)
    for (const m of misconceptions) for (const id of m.sourceIds) expect(sources.has(id), `${m.id} → ${id}`).toBe(true)
  })

  it('la posición de la clave está repartida (ninguna posición > 50 %)', () => {
    const counts = new Map<number, number>()
    for (const q of items) counts.set(q.options.findIndex((o) => o.correct), (counts.get(q.options.findIndex((o) => o.correct)) ?? 0) + 1)
    for (const [pos, n] of counts) expect(n / items.length, `clave en la posición ${pos + 1} en ${n}/${items.length}`).toBeLessThanOrEqual(0.5)
  })
})

describe('content/competencies.json', () => {
  const competencies = Competency.array().parse(read('competencies.json'))
  const byId = new Map(competencies.map((c) => [c.id, c]))
  const form = DiagnosticForm.parse(read('diagnostic/form.json'))

  it('hay exactamente 13 competencias, C01–C13, sin repetir', () => {
    const expected = Array.from({ length: 13 }, (_, i) => `C${String(i + 1).padStart(2, '0')}`)
    expect(competencies.map((c) => c.id).sort()).toEqual(expected)
  })

  it('el manual principal no se repite entre los de apoyo', () => {
    for (const c of competencies) expect(c.supportCourses.includes(c.primaryCourse), c.id).toBe(false)
  })

  it('toda competencia citada en cursos, preguntas y diagnóstico existe', () => {
    const refs: [string, string[]][] = []
    for (const courseId of readdirSync(resolve(root, 'content/courses'))) {
      const base = `courses/${courseId}`
      const course = Course.parse(read(`${base}/course.json`))
      refs.push([course.id, course.competencyIds])
      for (const o of course.evaluatedObjectives) refs.push([o.id, o.competencyIds])
      const qDir = resolve(root, 'content', base, 'questions')
      if (!existsSync(qDir)) continue
      for (const file of readdirSync(qDir).filter((f) => f.endsWith('.json') && f !== 'families.json'))
        for (const q of Question.array().parse(read(`${base}/questions/${file}`))) refs.push([q.id, q.competencyIds])
    }
    for (const q of Question.array().parse(read('diagnostic/items.json'))) refs.push([q.id, q.competencyIds])
    for (const b of form.blocks) refs.push([b.id, b.competencyIds])
    expect(refs.length).toBeGreaterThan(0)
    for (const [owner, ids] of refs) for (const id of ids) expect(byId.has(id), `${owner} → ${id}`).toBe(true)
  })

  it('el diagnosticBlock coincide con el bloque que la usa en el diagnóstico (C13 no se diagnostica)', () => {
    const blockOf = new Map<string, string>()
    for (const b of form.blocks)
      for (const id of b.competencyIds) {
        expect(blockOf.has(id), `${id} aparece en dos bloques`).toBe(false)
        blockOf.set(id, b.id)
      }
    for (const c of competencies) expect(c.diagnosticBlock, c.id).toBe(blockOf.get(c.id) ?? null)
    expect(byId.get('C13')?.diagnosticBlock).toBeNull()
  })
})

describe('design/asset-manifest.json', () => {
  const raw = JSON.parse(readFileSync(resolve(root, 'design/asset-manifest.json'), 'utf8'))
  const list: unknown[] = Array.isArray(raw) ? raw : raw.assets

  it('cada activo cumple el contrato Asset y su archivo existe', () => {
    const assets = Asset.array().parse(list)
    for (const a of assets) expect(existsSync(resolve(root, a.file)), a.file).toBe(true)
  })
})

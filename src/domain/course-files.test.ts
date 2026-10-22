// Valida cada manual de content/courses/ contra los contratos y contra sus propias referencias cruzadas:
// objetivos ↔ blueprint, preguntas ↔ lecciones, anclas, citas, fichas y conceptos erróneos.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Course, Lesson, Misconception, ProductCard, Question, Source } from './content'

const root = resolve(import.meta.dirname, '../../content')
const read = (p: string) => JSON.parse(readFileSync(resolve(root, p), 'utf8'))
const sources = new Set(Source.array().parse(read('sources.json')).map((s) => s.id))

/** IDs de encabezado declarados con `## Título {#id}` en el Markdown. */
function anchors(md: string): Set<string> {
  return new Set([...md.matchAll(/^#{2,4} .*\{#([a-z0-9-]+)\}\s*$/gm)].map((m) => m[1]))
}

/** Distribución de la posición de la clave por longitud: ni siempre la más larga ni siempre la más corta (R-C1-5). */
export function keyLengthBias(questions: Question[]): { longest: number; shortest: number; total: number } {
  let longest = 0
  let shortest = 0
  for (const q of questions) {
    const key = q.options.find((o) => o.correct)!.text.length
    const lens = q.options.map((o) => o.text.length)
    if (key === Math.max(...lens) && lens.filter((l) => l === key).length === 1) longest++
    if (key === Math.min(...lens) && lens.filter((l) => l === key).length === 1) shortest++
  }
  return { longest, shortest, total: questions.length }
}

for (const courseDir of readdirSync(resolve(root, 'courses'))) {
  describe(`content/courses/${courseDir}`, () => {
    const course = Course.parse(read(`courses/${courseDir}/course.json`))
    const eoIds = new Set(course.evaluatedObjectives.map((o) => o.id))
    const misconceptions = new Set(Misconception.array().parse(read(`courses/${courseDir}/misconceptions.json`)).map((m) => m.id))
    const cardsPath = `courses/${courseDir}/product-cards.json`
    const cards = existsSync(resolve(root, cardsPath)) ? ProductCard.array().parse(read(cardsPath)) : []
    const cardIds = new Set(cards.map((c) => c.id))
    const checksPath = `courses/${courseDir}/questions/checks.json`
    const checks = existsSync(resolve(root, checksPath)) ? Question.array().parse(read(checksPath)) : []
    const checkIds = new Set(checks.map((q) => q.id))
    const lessonFiles = readdirSync(resolve(root, `courses/${courseDir}/lessons`)).filter((f) => f.endsWith('.json'))
    const lessons = lessonFiles.map((f) => Lesson.parse(read(`courses/${courseDir}/lessons/${f}`)))

    it('cada lección escrita pertenece al blueprint y sus objetivos apuntan a objetivos evaluados', () => {
      for (const l of lessons) {
        expect(course.lessonIds, l.id).toContain(l.id)
        for (const o of l.objectives) expect(eoIds.has(o.evaluatedObjectiveId), `${l.id}/${o.id}`).toBe(true)
      }
    })

    it('las lecciones citan solo fuentes, fichas y preguntas que existen', () => {
      for (const l of lessons) {
        const md = readFileSync(resolve(root, l.bodyPath), 'utf8')
        for (const [, id] of md.matchAll(/:cite\[(src-[a-z0-9-]+)\]/g)) {
          expect(sources.has(id), `${l.id} cita ${id}`).toBe(true)
          expect(l.sourceIds, `${l.id} no declara ${id} en sourceIds`).toContain(id)
        }
        for (const [, id] of md.matchAll(/::product-card\{id="([a-z0-9-]+)"\}/g)) {
          expect(cardIds.has(id), `${l.id} usa la ficha ${id}`).toBe(true)
          expect(l.productCardIds, `${l.id} no declara la ficha ${id}`).toContain(id)
        }
        for (const id of [...l.checkQuestionIds, ...l.reviewQuestionIds]) expect(checkIds.has(id), `${l.id} → ${id}`).toBe(true)
        expect(md.includes('::check-questions'), `${l.id} sin marca de comprobación`).toBe(true)
        if (l.order > 1) expect(l.reviewQuestionIds.length, `${l.id} sin repaso (R-A2-1)`).toBeGreaterThanOrEqual(2)
      }
    })

    it('las preguntas apuntan a anclas, objetivos y conceptos erróneos existentes', () => {
      for (const q of checks) {
        const [lessonId, anchor] = q.sectionRef.split('#')
        const lesson = lessons.find((l) => l.id === lessonId)
        expect(lesson, `${q.id} → ${q.sectionRef}`).toBeDefined()
        const md = readFileSync(resolve(root, lesson!.bodyPath), 'utf8')
        expect(anchors(md).has(anchor), `${q.id}: no existe el ancla #${anchor}`).toBe(true)
        expect(eoIds.has(q.evaluatedObjectiveId!), q.id).toBe(true)
        for (const s of q.sourceIds) expect(sources.has(s), `${q.id} → ${s}`).toBe(true)
        for (const o of q.options) if (o.misconceptionId) expect(misconceptions.has(o.misconceptionId), `${q.id}/${o.id}`).toBe(true)
      }
    })

    it('la longitud no delata la clave: ni siempre la más larga ni siempre la más corta', () => {
      if (checks.length < 6) return
      const bias = keyLengthBias(checks)
      expect(bias.longest / bias.total, `clave más larga en ${bias.longest}/${bias.total}`).toBeLessThanOrEqual(0.5)
      expect(bias.shortest / bias.total, `clave más corta en ${bias.shortest}/${bias.total}`).toBeLessThanOrEqual(0.5)
    })

    it('fichas de producto: fuentes existentes', () => {
      for (const c of cards) for (const s of c.sourceIds) expect(sources.has(s), `${c.id} → ${s}`).toBe(true)
    })
  })
}

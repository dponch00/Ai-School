// Valida cada manual de content/courses/ contra los contratos y contra sus propias referencias cruzadas:
// objetivos ↔ blueprint, preguntas ↔ lecciones, anclas, citas, fichas y conceptos erróneos.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Asset, Course, Lesson, Misconception, Practice, ProductCard, Question, Source } from './content'
import { bankIssues, selectExam } from './scoring'

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
    const examPath = `courses/${courseDir}/questions/exam.json`
    const exam = existsSync(resolve(root, examPath)) ? Question.array().parse(read(examPath)) : []
    const practicePath = `courses/${courseDir}/questions/practice.json`
    const practiceItems = existsSync(resolve(root, practicePath)) ? Question.array().parse(read(practicePath)) : []
    const allQuestions = [...checks, ...exam, ...practiceItems]
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
        // Dos capas (M02-R-02): el cuerpo enuncia principios; productos y proveedores solo viven en fichas.
        const vendors = md.match(/\b(Codex|Claude|Copilot|Spec Kit|GPT-?\d|Gemini|Sonnet|Opus|Haiku|Fable|Anthropic|OpenAI|Google|GitHub|Cursor)\b/g)
        expect(vendors, `${l.id} menciona productos en el cuerpo: ${vendors?.join(', ')}`).toBeNull()
        if (l.order > 1) expect(l.reviewQuestionIds.length, `${l.id} sin repaso (R-A2-1)`).toBeGreaterThanOrEqual(2)
        const cardsInBody = [...md.matchAll(/::product-card\{/g)].length
        expect(cardsInBody, `${l.id}: ${cardsInBody} fichas; máximo 2 (guía de estilo §2.6)`).toBeLessThanOrEqual(2)
      }
    })

    it('las preguntas apuntan a anclas, objetivos y conceptos erróneos existentes', () => {
      for (const q of allQuestions) {
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
      for (const [name, set] of [['comprobaciones', checks], ['examen', exam]] as const) {
        if (set.length < 6) continue
        const bias = keyLengthBias(set)
        expect(bias.longest / bias.total, `${name}: clave más larga en ${bias.longest}/${bias.total}`).toBeLessThanOrEqual(0.4)
        expect(bias.shortest / bias.total, `${name}: clave más corta en ${bias.shortest}/${bias.total}`).toBeLessThanOrEqual(0.4)
      }
    })

    it('la posición de la clave está repartida en cada banco (ninguna posición > 50 %)', () => {
      for (const [name, set] of [['comprobaciones', checks], ['examen', exam], ['práctica', practiceItems]] as const) {
        if (set.length < 6) continue
        const counts = new Map<number, number>()
        for (const q of set) {
          const i = q.options.findIndex((o) => o.correct)
          counts.set(i, (counts.get(i) ?? 0) + 1)
        }
        for (const [pos, n] of counts) expect(n / set.length, `${name}: clave en la posición ${pos + 1} en ${n}/${set.length}`).toBeLessThanOrEqual(0.5)
      }
    })

    it('banco de examen: coherente, con cobertura del blueprint y separado de las comprobaciones (D-016, D-017)', () => {
      if (exam.length === 0) return
      expect(bankIssues(exam)).toEqual([])
      for (const q of exam) expect(checkIds.has(q.id), `${q.id} repite un ID de comprobación`).toBe(false)
      const checkScenarios = new Set(checks.map((q) => q.scenario))
      for (const q of exam) expect(checkScenarios.has(q.scenario), `${q.id} reutiliza un escenario de comprobación`).toBe(false)
      for (const eo of course.evaluatedObjectives) {
        const families = new Set(exam.filter((q) => q.evaluatedObjectiveId === eo.id).map((q) => q.family))
        expect(families.size, `${eo.id}: familias en el banco`).toBeGreaterThanOrEqual(2)
      }
      const variantsByFamily = new Map<string, number>()
      for (const q of exam) variantsByFamily.set(q.family!, (variantsByFamily.get(q.family!) ?? 0) + 1)
      for (const [family, n] of variantsByFamily) expect(n, `${family}: variantes`).toBeGreaterThanOrEqual(2)
      // Se puede armar un examen de 12 con 2 ítems por objetivo evaluado
      const published = exam.map((q) => ({ ...q, status: 'published' as const }))
      let seed = 42
      const rng = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)
      const form = selectExam({ bank: published, evaluatedObjectiveIds: course.evaluatedObjectives.map((o) => o.id), itemsPerObjective: 2, rng })
      expect(form).toHaveLength(course.evaluatedObjectives.length * 2)
    })

    it('banco de práctica separado del examen (estándar §4.1) y familias del examen documentadas (T-009)', () => {
      const ids = allQuestions.map((q) => q.id)
      expect(new Set(ids).size, 'IDs repetidos entre comprobaciones, examen y práctica').toBe(ids.length)
      for (const q of practiceItems) expect(q.use, q.id).toBe('practice')
      const examScenarios = new Set(exam.map((q) => q.scenario))
      for (const q of practiceItems) expect(examScenarios.has(q.scenario), `${q.id} comparte escenario con el examen`).toBe(false)
      const famPath = `courses/${courseDir}/questions/families.json`
      if (exam.length === 0) return
      expect(existsSync(resolve(root, famPath)), 'falta families.json').toBe(true)
      const families: { family: string; evaluatedObjectiveId: string; decision: string; equivalence: string }[] = read(famPath)
      const byId = new Map(families.map((f) => [f.family, f]))
      for (const q of exam) {
        const f = byId.get(q.family!)
        expect(f, `${q.family} sin decisión documentada`).toBeDefined()
        expect(f!.evaluatedObjectiveId, `${q.id}: objetivo distinto del de su familia`).toBe(q.evaluatedObjectiveId)
        expect(f!.decision.length + f!.equivalence.length, q.family).toBeGreaterThan(40)
      }
    })

    it('laboratorio: cumple el contrato Practice y cubre objetivos del blueprint', () => {
      const labPath = `courses/${courseDir}/practice/${course.practiceId}.json`
      if (!existsSync(resolve(root, labPath))) return
      const lab = Practice.parse(read(labPath))
      expect(existsSync(resolve(root, lab.instructionsPath)), lab.instructionsPath).toBe(true)
      for (const id of lab.evaluatedObjectiveIds) expect(eoIds.has(id), `${lab.id} → ${id}`).toBe(true)
      expect(lab.rubric.some((c) => c.critical), 'al menos un criterio crítico').toBe(true)
    })

    it('las competencias de objetivos y preguntas pertenecen al manual (M02-R-01)', () => {
      const own = new Set(course.competencyIds)
      for (const eo of course.evaluatedObjectives) for (const c of eo.competencyIds) expect(own.has(c), `${eo.id} declara ${c}`).toBe(true)
      for (const q of allQuestions) for (const c of q.competencyIds) expect(own.has(c), `${q.id} declara ${c}`).toBe(true)
    })

    it('el feedback de cada opción tiene al menos dos frases (estándar §4.4, M02-R-09)', () => {
      for (const q of allQuestions)
        for (const o of q.options) {
          const sentences = o.feedback.split(/[.!?](?:\s|$)/).filter((x) => x.trim().length > 0)
          expect(sentences.length, `${q.id}/${o.id}`).toBeGreaterThanOrEqual(2)
        }
    })

    it('los diagramas e imágenes que usan las lecciones existen y cumplen el contrato Asset', () => {
      const assetsPath = `courses/${courseDir}/assets.json`
      const assets = existsSync(resolve(root, assetsPath)) ? Asset.array().parse(read(assetsPath)) : []
      const assetIds = new Set(assets.map((a) => a.id))
      for (const a of assets) expect(existsSync(resolve(root, '..', a.file)), a.file).toBe(true)
      for (const l of lessons) {
        const md = readFileSync(resolve(root, l.bodyPath), 'utf8')
        for (const [, id] of md.matchAll(/::figure\{asset="([a-z0-9-]+)"\}/g)) {
          expect(assetIds.has(id), `${l.id} usa el activo ${id}`).toBe(true)
          expect(l.assetIds, `${l.id} no declara el activo ${id}`).toContain(id)
        }
        for (const id of l.assetIds) expect(assetIds.has(id), `${l.id} → ${id}`).toBe(true)
      }
    })

    it('fichas de producto: fuentes existentes', () => {
      for (const c of cards) for (const s of c.sourceIds) expect(sources.has(s), `${c.id} → ${s}`).toBe(true)
    })
  })
}

// Todas las rutas: sin violaciones de axe (WCAG 2.2 A/AA) y sin desplazamiento horizontal.
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const RUTAS = [
  ['inicio', '/#/'],
  ['cursos', '/#/cursos'],
  ['portada M02', '/#/cursos/m02'],
  ['lección 1', '/#/cursos/m02/lecciones/m02-l1'],
  ['lección 4 (diagrama)', '/#/cursos/m02/lecciones/m02-l4'],
  ['laboratorio', '/#/cursos/m02/laboratorio'],
  ['práctica', '/#/cursos/m02/practica'],
  ['examen', '/#/cursos/m02/examen'],
  ['repaso de errores', '/#/cursos/m02/repaso'],
  ['diagnóstico', '/#/diagnostico'],
  ['respaldo', '/#/respaldo'],
  ['buscar (con resultados)', '/#/buscar?q=invariante'],
  ['glosario', '/#/glosario?termino=g-invariante'],
  ['mis notas', '/#/notas'],
  ['cómo funciona', '/#/como-funciona'],
  ['portada M01', '/#/cursos/m01'],
  ['laboratorio M01', '/#/cursos/m01/laboratorio'],
  ['examen M01', '/#/cursos/m01/examen'],
  ['M01 lección 3', '/#/cursos/m01/lecciones/m01-l3'],
  ['M01 lección 5 (fichas de precios)', '/#/cursos/m01/lecciones/m01-l5'],
] as const

for (const [nombre, ruta] of RUTAS) {
  test(`${nombre}: accesible y sin desborde horizontal`, async ({ page }) => {
    await page.goto(ruta)
    await expect(page.locator('main h1').first()).toBeVisible()
    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const resumen = resultado.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} · ${v.nodes[0]?.target.join(' ')}`)
    expect(resumen, 'violaciones de axe').toEqual([])
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(desborde, 'desplazamiento horizontal').toBeLessThanOrEqual(0)
  })
}

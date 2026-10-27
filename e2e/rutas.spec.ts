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
  ['portada M03', '/#/cursos/m03'],
  ['laboratorio M03', '/#/cursos/m03/laboratorio'],
  ['examen M03', '/#/cursos/m03/examen'],
  ['M03 lección 2', '/#/cursos/m03/lecciones/m03-l2'],
  ['M03 lección 4', '/#/cursos/m03/lecciones/m03-l4'],
  ['portada M04', '/#/cursos/m04'],
  ['laboratorio M04 (código)', '/#/cursos/m04/laboratorio'],
  ['examen M04', '/#/cursos/m04/examen'],
  ['portada M05', '/#/cursos/m05'],
  ['M05 lección 1', '/#/cursos/m05/lecciones/m05-l1'],
  ['laboratorio M05', '/#/cursos/m05/laboratorio'],
  ['examen M05', '/#/cursos/m05/examen'],
  ['portada M06', '/#/cursos/m06'],
  ['M06 lección 4 (tabla de herramientas)', '/#/cursos/m06/lecciones/m06-l4'],
  ['laboratorio M06', '/#/cursos/m06/laboratorio'],
  ['examen M06', '/#/cursos/m06/examen'],
  ['portada M07', '/#/cursos/m07'],
  ['M07 lección 1 (JSON)', '/#/cursos/m07/lecciones/m07-l1'],
  ['M07 lección 3 (tabla de códigos)', '/#/cursos/m07/lecciones/m07-l3'],
  ['M07 lección 4 (serie de casos)', '/#/cursos/m07/lecciones/m07-l4'],
  ['laboratorio M07', '/#/cursos/m07/laboratorio'],
  ['examen M07', '/#/cursos/m07/examen'],
  ['portada M08', '/#/cursos/m08'],
  ['M08 lección 1 (tabla de patrones)', '/#/cursos/m08/lecciones/m08-l1'],
  ['M08 lección 5 (hooks)', '/#/cursos/m08/lecciones/m08-l5'],
  ['laboratorio M08', '/#/cursos/m08/laboratorio'],
  ['examen M08', '/#/cursos/m08/examen'],
  ['portada M09', '/#/cursos/m09'],
  ['M09 lección 1 (tabla de ensayos)', '/#/cursos/m09/lecciones/m09-l1'],
  ['M09 lección 4 (graders de cifras)', '/#/cursos/m09/lecciones/m09-l4'],
  ['M09 lección 5 (capas)', '/#/cursos/m09/lecciones/m09-l5'],
  ['laboratorio M09', '/#/cursos/m09/laboratorio'],
  ['examen M09', '/#/cursos/m09/examen'],
  ['portada M10', '/#/cursos/m10'],
  ['M10 lección 2 (criterios de accesibilidad)', '/#/cursos/m10/lecciones/m10-l2'],
  ['M10 lección 4 (publicación)', '/#/cursos/m10/lecciones/m10-l4'],
  ['M10 lección 6 (mantenimiento)', '/#/cursos/m10/lecciones/m10-l6'],
  ['laboratorio M10', '/#/cursos/m10/laboratorio'],
  ['examen M10', '/#/cursos/m10/examen'],
  ['M04 lección 1 (código)', '/#/cursos/m04/lecciones/m04-l1'],
  ['M04 lección 3', '/#/cursos/m04/lecciones/m04-l3'],
  ['M04 lección 4 (Git)', '/#/cursos/m04/lecciones/m04-l4'],
  ['M04 lección 6', '/#/cursos/m04/lecciones/m04-l6'],
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

// F4-05: con la letra al doble en un teléfono (como el tamaño de fuente grande de Android), nada se sale de la pantalla.
// Incluye M07 L2, cuyo escenario trae una cadena larga sin espacios.
const LETRA_GRANDE = ['/#/', '/#/como-funciona', '/#/cursos/m01', '/#/cursos/m07/lecciones/m07-l2', '/#/cursos/m10/laboratorio', '/#/cursos/m04/lecciones/m04-l1']
for (const ruta of LETRA_GRANDE) {
  test(`letra al 200 % a 360 px: ${ruta}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 })
    await page.goto(ruta)
    await expect(page.locator('main h1').first()).toBeVisible()
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(desborde, 'desplazamiento horizontal').toBeLessThanOrEqual(0)
  })
}

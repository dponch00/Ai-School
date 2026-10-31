// Flujos principales con teclado, persistencia y modo sin conexión.
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('el inicio orienta con continuar y los diez manuales (T-055)', async ({ page }) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: 'Tu estudio' })).toBeVisible()
  const continueCard = page.locator('.continue-card')
  await expect(continueCard).toHaveAttribute('href', /#\/cursos\/m01\/lecciones\/m01-l1$/)
  await expect(page.locator('.study-course')).toHaveCount(10)
  await expect(page.locator('.brand__mark')).toBeVisible()
})

test('un término abre el panel lateral, encadena relaciones y «atrás» lo cierra sin dejar la lección', async ({ page }) => {
  await page.goto('/#/cursos/m01/lecciones/m01-l1')
  const term = page.locator('.lesson-body a.term[data-term="g-api"]').first()
  await expect(term).toBeVisible()
  await term.click()
  const panel = page.getByRole('dialog', { name: /API/ })
  await expect(panel).toBeVisible()
  await expect(panel.locator('.relation__lead')).toContainText('solicitud')
  // Se explica en M01 L5: el apartado se abre dentro del panel, como anticipo.
  await panel.getByRole('button', { name: /M01 · L5/ }).click()
  await expect(panel.locator('.relation__kind')).toHaveText(/anticipar/)
  await expect(panel.locator('.relation__body')).toContainText('clave de API')
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(axe.violations.map((v) => v.id)).toEqual([])
  await panel.getByRole('button', { name: 'Volver a la relación anterior' }).click()
  await expect(panel.locator('.relation__kind')).toHaveText('Definición')
  await page.goBack()
  await expect(panel).toBeHidden()
  await expect(page).toHaveURL(/m01-l1$/)
  // Una cita abre su fuente en el panel; Esc lo cierra.
  await page.locator('.lesson-body sup.cite a').first().click()
  await expect(page.getByRole('dialog')).toContainText('Fuente citada')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('una comprobación se responde con teclado y la lección queda completada tras recargar', async ({ page }) => {
  await page.goto('/#/cursos/m02/lecciones/m02-l1')
  const preguntas = page.locator('section.checks fieldset.question')
  // El cuerpo de la lección llega en el paquete del curso (F2-05): se espera a que aparezca.
  await expect(preguntas.first()).toBeVisible()
  const total = await preguntas.count()
  expect(total).toBeGreaterThan(0)
  for (let i = 0; i < total; i++) {
    const p = preguntas.nth(i)
    await p.locator('input[type=radio]').first().focus()
    await page.keyboard.press('Space')
    await p.getByRole('button', { name: 'Comprobar' }).press('Enter')
    await expect(p.locator('.option__feedback').first()).toBeVisible()
  }
  await page.goto('/#/cursos/m02')
  await page.reload()
  await expect(page.locator('.lesson-list__status', { hasText: 'Completada' }).first()).toBeVisible()
})

test('el examen se retoma donde quedó después de recargar', async ({ page }) => {
  await page.goto('/#/cursos/m02/examen')
  await page.getByRole('button', { name: 'Empezar el examen' }).click()
  await expect(page.locator('fieldset.question').first()).toBeVisible()
  await page.locator('fieldset.question').first().locator('input[type=radio]').first().check()
  await expect(page.locator('.exam__progress')).toContainText('Respondidas 1 de 12')
  await page.reload()
  await expect(page.locator('.exam__progress')).toContainText('Respondidas 1 de 12')
})

test('sin conexión, la app y una lección cargan desde la caché del service worker', async ({ page, context }) => {
  await page.goto('/#/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  // La primera visita instala el SW; la segunda ya queda controlada por él.
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  // D-029: el service worker guarda al instalarse los paquetes de todos los cursos; no hace falta descargarlos.
  await page.goto('/#/cursos/m02')
  await expect(page.getByText('Disponible sin conexión en este dispositivo')).toBeVisible()
  await context.setOffline(true)
  await page.goto('/#/cursos/m02/lecciones/m02-l2')
  await expect(page.locator('main h1')).toContainText('Contexto pertinente')
  // El diagrama de la lección 4 también sale de la caché (carga diferida al llegar a él).
  await page.goto('/#/cursos/m02/lecciones/m02-l4')
  const figura = page.locator('figure img').first()
  await figura.scrollIntoViewIfNeeded()
  await expect.poll(() => figura.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  await context.setOffline(false)
})

test('la búsqueda encuentra un término y lleva a su apartado en la lección', async ({ page }) => {
  await page.goto('/#/buscar')
  await page.getByLabel('Buscar en las lecciones, el laboratorio y el glosario').fill('invariante')
  const resultado = page.locator('.search-result', { hasText: 'La forma no es la verdad' }).first()
  await expect(resultado).toBeVisible()
  await resultado.click()
  await expect(page).toHaveURL(/lecciones\/m02-l3\?seccion=forma-verdad/)
  await expect(page.locator('main h1')).toContainText('Ejemplos, contraejemplos')
})

test('una nota y un marcador de lección se guardan y aparecen en «Mis notas»', async ({ page }) => {
  await page.goto('/#/cursos/m02/lecciones/m02-l2')
  await page.getByRole('button', { name: /Marcar esta lección/ }).click()
  await page.getByLabel(/Nota sobre esta lección/).fill('Repasar la política de supuestos')
  await page.getByRole('button', { name: 'Guardar nota' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Nota guardada' })).toBeVisible()
  await page.goto('/#/notas')
  await expect(page.getByText('Repasar la política de supuestos')).toBeVisible()
  await expect(page.locator('#marcadores ~ ul a', { hasText: 'Lección 2' })).toBeVisible()
})

test('una nota viaja en el respaldo descargado', async ({ page }) => {
  const texto = 'NOTA-SINTETICA-7Q'
  await page.goto('/#/cursos/m02/lecciones/m02-l1')
  await page.getByLabel(/Nota sobre esta lección/).fill(texto)
  await page.getByRole('button', { name: 'Guardar nota' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Nota guardada' })).toBeVisible()

  await page.goto('/#/respaldo')
  const descarga = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar respaldo completo' }).click()
  const archivo = await (await descarga).path()
  const { readFileSync } = await import('node:fs')
  expect(readFileSync(archivo!, 'utf8')).toContain(texto)
  await expect(page.getByRole('status').filter({ hasText: 'Respaldo descargado' })).toBeVisible()
})

test('el laboratorio es un caso de opción múltiple: al responder todo queda hecho (D-024)', async ({ page }) => {
  await page.goto('/#/cursos/m02/laboratorio')
  const preguntas = page.locator('section.lab-step fieldset.question')
  await expect(preguntas.first()).toBeVisible()
  const total = await preguntas.count()
  expect(total).toBe(12)
  // Ningún campo de texto que llenar en el laboratorio.
  await expect(page.locator('main textarea')).toHaveCount(0)
  for (let i = 0; i < total; i++) {
    const p = preguntas.nth(i)
    await p.locator('input[type=radio]').first().check()
    await p.getByRole('button', { name: 'Comprobar' }).click()
    await expect(p.locator('.option__feedback').first()).toBeVisible()
  }
  await expect(page.getByRole('status').filter({ hasText: 'El laboratorio cuenta como hecho' })).toBeVisible()
  await page.goto('/#/cursos/m02')
  await expect(page.locator('.lesson-list__status', { hasText: /^Hecho · \d+\/12$/ })).toBeVisible()
})

test('la búsqueda lleva al término del glosario, que recibe el foco, y sus referencias llevan a la lección (T020-04)', async ({ page }) => {
  await page.goto('/#/buscar?q=invariante')
  const enGlosario = page.locator('.search-result', { hasText: 'Glosario' }).filter({ hasText: 'Invariante' }).first()
  await expect(enGlosario).toBeVisible()
  await enGlosario.click()
  await expect(page).toHaveURL(/glosario\?termino=g-invariante/)
  await expect(page.locator('#g-invariante')).toHaveClass(/glossary__term--target/)
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('g-invariante')
  const refs = page.locator('#g-invariante .glossary__refs a')
  await expect(refs).toHaveCount(1)
  await refs.first().click()
  await expect(page).toHaveURL(/lecciones\/m02-l3\?seccion=forma-verdad/)
  await expect(page.locator('#forma-verdad')).toBeVisible()
})


test('se subraya un texto con nota, se ve en «Subrayados» y el enlace vuelve al punto de la lección', async ({ page }) => {
  await page.goto('/#/cursos/m02/lecciones/m02-l1')
  await expect(page.locator('.lesson-body .prose p').first()).toBeVisible()
  // Selecciona el comienzo de un párrafo largo de la lección.
  await page.evaluate(() => {
    const p = [...document.querySelectorAll('.lesson-body .prose p')].find((x) => (x.textContent ?? '').length > 120)!
    const t = document.createTreeWalker(p, NodeFilter.SHOW_TEXT).nextNode() as Text
    const r = document.createRange()
    r.setStart(t, 0)
    r.setEnd(t, Math.min(30, t.data.length))
    getSelection()!.removeAllRanges()
    getSelection()!.addRange(r)
  })
  await page.getByRole('toolbar', { name: 'Subrayar la selección' }).getByRole('button', { name: 'Subrayar y anotar' }).click()
  const editor = page.getByRole('dialog', { name: 'Subrayado' })
  await editor.getByLabel(/Tu nota/).fill('Nota de prueba del subrayado')
  const axeEditor = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(axeEditor.violations.map((v) => v.id)).toEqual([])
  await editor.getByRole('button', { name: 'Listo' }).click()
  const mark = page.locator('.lesson-body mark[data-hl-id]').first()
  await expect(mark).toBeVisible()
  await expect(page.locator('.hl-list__note')).toHaveText('Nota de prueba del subrayado')

  await page.goto('/#/notas')
  await expect(page.locator('.notes-lesson .hl-list__note')).toHaveText('Nota de prueba del subrayado')
  const axeNotes = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(axeNotes.violations.map((v) => v.id)).toEqual([])
  // Modo repaso: el texto subrayado queda oculto hasta destaparlo.
  await page.getByLabel('Modo repaso').check()
  await expect(page.locator('.notes-lesson mark')).toHaveCount(0)
  await page.getByRole('button', { name: 'Mostrar el subrayado' }).click()
  await expect(page.locator('.notes-lesson mark')).toHaveCount(1)
  await page.getByRole('link', { name: 'Ir a la sección' }).click()
  await expect(page.locator('.lesson-body mark[data-hl-id]').first()).toBeInViewport()
})

/** Selecciona los caracteres [from, to) del primer nodo de texto del primer párrafo largo de la lección. */
async function selectInLongParagraph(page: import('@playwright/test').Page, from: number, to: number) {
  await page.evaluate(([a, b]) => {
    const p = [...document.querySelectorAll('.lesson-body .prose p')].find((x) => (x.textContent ?? '').length > 120)!
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest('[data-hl-aux]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    })
    // Tras subrayar, el texto queda partido en varios nodos: se busca el que contiene el desplazamiento.
    let offset = 0
    const point = (target: number): [Node, number] => {
      walker.currentNode = p
      offset = 0
      for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
        if (target <= offset + n.data.length) return [n, target - offset]
        offset += n.data.length
      }
      throw new Error('fuera del párrafo')
    }
    const r = document.createRange()
    r.setStart(...point(a))
    r.setEnd(...point(b))
    getSelection()!.removeAllRanges()
    getSelection()!.addRange(r)
  }, [from, to])
}

test('subrayados que se cruzan se unen; color, Esc y la nota funcionan con teclado; «Subrayados» no desborda (T-036)', async ({ page }) => {
  await page.goto('/#/cursos/m02/lecciones/m02-l1')
  await expect(page.locator('.lesson-body .prose p').first()).toBeVisible()
  const bar = page.getByRole('toolbar', { name: 'Subrayar la selección' })
  const marks = page.locator('.lesson-body mark[data-hl-id]')

  await selectInLongParagraph(page, 0, 30)
  await bar.getByRole('button', { name: 'Subrayar en verde' }).click()
  await expect(marks.first()).toHaveClass(/hl--verde/)
  // Empezar en el borde del párrafo no arrastra la última palabra del bloque anterior.
  expect(await marks.evaluateAll((ms) => new Set(ms.map((m) => m.closest('p'))).size)).toBe(1)

  // Una selección que se cruza no crea una marca anidada: se ofrece unirla.
  await selectInLongParagraph(page, 20, 60)
  await expect(bar.getByText('Se cruza con un subrayado tuyo.')).toBeVisible()
  await bar.getByRole('button', { name: 'Unir al subrayado' }).click()
  await expect(page.getByRole('heading', { name: 'Mis subrayados en esta lección (1)' })).toBeVisible()
  expect(await page.locator('.lesson-body mark mark').count()).toBe(0)
  const ids = await marks.evaluateAll((ms) => [...new Set(ms.map((m) => (m as HTMLElement).dataset.hlId))])
  expect(ids).toHaveLength(1)

  // Una selección dentro del subrayado ofrece editarlo.
  await selectInLongParagraph(page, 5, 15)
  await bar.getByRole('button', { name: 'Editar el subrayado' }).click()
  const editor = page.getByRole('dialog', { name: 'Subrayado' })
  await editor.getByRole('button', { name: 'Rosa' }).click()
  await expect(marks.first()).toHaveClass(/hl--rosa/)
  await page.keyboard.press('Escape')
  await expect(editor).toHaveCount(0)

  // Con nota, el final del subrayado es un botón ✎ que abre el editor con el foco en la nota.
  await page.getByRole('button', { name: 'Agregar una nota' }).click()
  await editor.getByLabel(/Tu nota/).fill('Una nota')
  await editor.getByRole('button', { name: 'Listo' }).click()
  const pencil = page.getByRole('button', { name: 'Ver o editar la nota de este subrayado' })
  await pencil.focus()
  await page.keyboard.press('Enter')
  await expect(editor.getByLabel(/Tu nota/)).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(pencil).toBeFocused()
  // El texto auxiliar para lectores de pantalla no entra en la cita guardada.
  await expect(page.locator('.hl-list__quote mark')).not.toContainText('Subrayado en')

  await page.goto('/#/notas')
  await expect(page.locator('.notes-lesson .hl-list__note')).toHaveText('Una nota')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

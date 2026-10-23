// Flujos principales con teclado, persistencia y modo sin conexión.
import { expect, test } from '@playwright/test'

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
  // F2-05: el curso se descarga para usarlo sin conexión desde su portada.
  await page.goto('/#/cursos/m02')
  await page.getByRole('button', { name: /Descargar para usar sin conexión/ }).click()
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


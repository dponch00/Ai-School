// Flujos principales con teclado, persistencia y modo sin conexión.
import { expect, test } from '@playwright/test'

test('una comprobación se responde con teclado y la lección queda completada tras recargar', async ({ page }) => {
  await page.goto('/#/cursos/m02/lecciones/m02-l1')
  const preguntas = page.locator('section.checks fieldset.question')
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

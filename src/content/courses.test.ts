// Carga de paquetes por curso (F2-05) con un fetch simulado.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCourse, loadCourse, resetCourseCache } from './index'

afterEach(() => resetCourseCache())

const course = getCourse('m02')!
const body = readFileSync(resolve(import.meta.dirname, '../../public', course.package.url.slice(1)), 'utf8')
const ok = () => vi.fn(async () => new Response(body, { status: 200 }))

describe('paquetes por curso', () => {
  it('el índice del curso no trae el cuerpo de las lecciones; el paquete sí, con sus preguntas', async () => {
    expect((course.lessons[0] as unknown as { blocks?: unknown }).blocks).toBeUndefined()
    const pkg = await loadCourse('m02', ok() as unknown as typeof fetch)
    expect(Object.keys(pkg.lessons)).toEqual(course.lessons.map((l) => l.id))
    expect(Object.values(pkg.questions).some((q) => q.use === 'exam')).toBe(true)
  })

  it('pide el paquete con su verificación de integridad y lo descarga una sola vez', async () => {
    const f = ok()
    await Promise.all([loadCourse('m02', f as unknown as typeof fetch), loadCourse('m02', f as unknown as typeof fetch)])
    await loadCourse('m02', f as unknown as typeof fetch)
    expect(f).toHaveBeenCalledTimes(1)
    expect(f).toHaveBeenCalledWith(course.package.url, { integrity: course.package.integrity })
    expect(course.package.integrity).toMatch(/^sha384-/)
  })

  it('rechaza un paquete de otra versión y permite reintentar después de un fallo', async () => {
    const otra = vi.fn(async () => new Response(JSON.stringify({ ...JSON.parse(body), version: '9.9.9' })))
    await expect(loadCourse('m02', otra as unknown as typeof fetch)).rejects.toThrow('no corresponde')
    await expect(loadCourse('m02', ok() as unknown as typeof fetch)).resolves.toBeDefined()
  })

  it('un error de red se informa sin romper la app', async () => {
    const caida = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(loadCourse('m02', caida as unknown as typeof fetch)).rejects.toThrow(/No se pudo cargar el curso|sin conexión/)
  })
})

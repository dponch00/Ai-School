// Acceso tipado al contenido generado por scripts/build-content.ts.
// El índice de cada curso viaja en el paquete principal; lo pesado (lecciones, preguntas, fichas) se carga
// por curso desde public/courses con verificación de integridad (F2-05).
import { useEffect, useState } from 'react'
import data from '../generated/content.json'
import type { Asset, Competency, Course, DiagnosticForm, GlossaryTerm, Lesson, Practice, ProductCard, Question } from '../domain/content'

export type Block =
  | { type: 'html'; html: string }
  | { type: 'product-card'; id: string }
  | { type: 'figure'; id: string }
  | { type: 'check-questions' }
  /** Preguntas del laboratorio para un paso (`::lab-questions{step=…}`, D-024). */
  | { type: 'lab-questions'; id: string }

export interface TocEntry {
  id: string
  text: string
}

export interface SourceRef {
  n: number
  id: string
  title: string
  organization: string
  url: string
  accessedAt: string
}

/** Índice de una lección: lo necesario para listarla y navegarla, sin su cuerpo. */
export interface LessonView extends Lesson {
  toc: TocEntry[]
}

/** El laboratorio salvo el cuerpo de sus instrucciones. */
export interface PracticeView extends Practice {
  toc: TocEntry[]
}

export interface CourseView extends Course {
  lessons: LessonView[]
  practice: PracticeView | null
  /** Todas las lecciones, el laboratorio y el banco de examen: solo entonces figura como disponible. */
  complete: boolean
  package: { url: string; integrity: string; bytes: number }
}

/** Lo pesado de un curso: se descarga aparte y queda en la caché del SW para usarlo sin conexión. */
export interface CoursePackage {
  id: string
  version: string
  lessons: Record<string, { blocks: Block[]; sources: SourceRef[] }>
  practiceBlocks: Block[] | null
  questions: Record<string, Question>
  productCards: Record<string, ProductCard>
  assets: Record<string, Asset & { url: string }>
}

export interface CatalogEntry {
  id: string
  title: string
  centralQuestion: string
  available: boolean
}

export interface SearchDoc {
  id: string
  kind: 'section' | 'lab' | 'glossary'
  courseId: string | null
  lessonId?: string
  anchor?: string
  title: string
  /** Dónde está: curso y lección, laboratorio o glosario. */
  context: string
  text: string
}

interface ContentData {
  generatedAt: string
  catalog: CatalogEntry[]
  courses: CourseView[]
  competencies: Record<string, Competency>
  diagnostic: { form: DiagnosticForm }
  glossary: GlossaryTerm[]
  /** Solo las del diagnóstico: las de cada curso viajan en su paquete. */
  questions: Record<string, Question>
  sources: Record<string, { id: string; title: string; organization: string; url: string }>
}

export const content = data as unknown as ContentData

export function getCourse(id: string | undefined): CourseView | undefined {
  return content.courses.find((c) => c.id === id)
}

export function getLesson(course: CourseView, lessonId: string | undefined): LessonView | undefined {
  return course.lessons.find((l) => l.id === lessonId)
}

// ---------- Paquetes por curso (F2-05) ----------

const loaded = new Map<string, CoursePackage>()
const inflight = new Map<string, Promise<CoursePackage>>()

/**
 * Descarga el paquete de un curso y verifica su integridad (SRI). Con el SW activo, la respuesta queda en su
 * caché y el curso funciona sin conexión. Si no hay red y no se descargó antes, falla con un mensaje claro.
 */
/** URL del paquete bajo la ruta base de la app ('/' en local, '/Ai-School/' en GitHub Pages). */
const packageUrl = (url: string) => import.meta.env.BASE_URL + url.replace(/^\//, '')

export function loadCourse(id: string, fetcher: typeof fetch = fetch): Promise<CoursePackage> {
  const hit = loaded.get(id)
  if (hit) return Promise.resolve(hit)
  const pending = inflight.get(id)
  if (pending) return pending
  const course = getCourse(id)
  if (!course) return Promise.reject(new Error(`No existe el curso ${id}`))
  const p = fetcher(packageUrl(course.package.url), { integrity: course.package.integrity })
    .then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const pkg = (await r.json()) as CoursePackage
      if (pkg.id !== course.id || pkg.version !== course.version) throw new Error('El paquete no corresponde a esta versión del curso')
      loaded.set(id, pkg)
      return pkg
    })
    .catch((e: unknown) => {
      inflight.delete(id)
      throw new Error(
        typeof navigator !== 'undefined' && navigator.onLine === false
          ? 'Este curso no está descargado para usarlo sin conexión. Conéctate y vuelve a abrirlo.'
          : `No se pudo cargar el curso: ${e instanceof Error ? e.message : String(e)}`,
      )
    })
  inflight.set(id, p)
  return p
}

/** Para las pruebas: olvida los paquetes cargados. */
export function resetCourseCache() {
  loaded.clear()
  inflight.clear()
}

export function useCoursePackage(id: string | undefined): { pkg: CoursePackage | null; error: string | null } {
  const [state, setState] = useState<{ pkg: CoursePackage | null; error: string | null }>(() => ({ pkg: (id && loaded.get(id)) || null, error: null }))
  useEffect(() => {
    if (!id) return
    let alive = true
    loadCourse(id).then(
      (pkg) => alive && setState({ pkg, error: null }),
      (e: unknown) => alive && setState({ pkg: null, error: e instanceof Error ? e.message : String(e) }),
    )
    return () => {
      alive = false
    }
  }, [id])
  return state
}

/**
 * Descarga el curso y espera a que el SW termine de guardarlo en su caché (lo hace en segundo plano, así que
 * la respuesta llega antes que el guardado). Devuelve si quedó disponible sin conexión.
 */
export async function downloadCourse(id: string, tries = 15, waitMs = 200): Promise<boolean> {
  await loadCourse(id)
  for (let i = 0; i < tries; i++) {
    if (await isCourseOffline(id)) return true
    await new Promise((r) => setTimeout(r, waitMs))
  }
  return false
}

/** Si el paquete del curso ya está en la caché del dispositivo (descargado para usar sin conexión). */
export async function isCourseOffline(id: string): Promise<boolean> {
  const course = getCourse(id)
  if (!course || typeof caches === 'undefined') return false
  try {
    return !!(await caches.match(packageUrl(course.package.url), { ignoreSearch: true }))
  } catch {
    // Algunos entornos (un iframe aislado, navegación privada) no dejan usar la caché.
    return false
  }
}

/** Documentos de búsqueda: van en un archivo aparte que se carga solo al abrir la búsqueda. */
export const loadSearchDocs = (): Promise<SearchDoc[]> => import('../generated/search.json').then((m) => m.default as unknown as SearchDoc[])

/** Portada de cada curso (T-053). */
export const covers: Record<string, string> = Object.fromEntries(
  ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10'].map((id) => [id, `${id}-cover`]),
)

export function imageSrcSet(name: string): string {
  return [480, 960, 1600].map((w) => `${import.meta.env.BASE_URL}images/${name}-${w}.webp ${w}w`).join(', ')
}

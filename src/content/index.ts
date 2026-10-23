// Acceso tipado al contenido generado por scripts/build-content.ts.
import data from '../generated/content.json'
import type { Asset, Competency, Course, DiagnosticForm, GlossaryTerm, Lesson, Microtask, Practice, ProductCard, Question } from '../domain/content'

export type Block =
  | { type: 'html'; html: string }
  | { type: 'product-card'; id: string }
  | { type: 'figure'; id: string }
  | { type: 'check-questions' }

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

export interface LessonView extends Lesson {
  toc: TocEntry[]
  blocks: Block[]
  sources: SourceRef[]
}

export interface PracticeView extends Practice {
  toc: TocEntry[]
  blocks: Block[]
}

export interface CourseView extends Course {
  lessons: LessonView[]
  practice: PracticeView | null
}

export interface CatalogEntry {
  id: string
  title: string
  centralQuestion: string
  available: boolean
}

export interface MicrotaskView extends Microtask {
  materialBlocks: Block[]
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
  diagnostic: { form: DiagnosticForm; microtasks: MicrotaskView[] }
  glossary: GlossaryTerm[]
  searchDocs: SearchDoc[]
  questions: Record<string, Question>
  productCards: Record<string, ProductCard>
  assets: Record<string, Asset & { url: string }>
  sources: Record<string, { id: string; title: string; organization: string; url: string }>
}

export const content = data as unknown as ContentData

export function getCourse(id: string | undefined): CourseView | undefined {
  return content.courses.find((c) => c.id === id)
}

export function getLesson(course: CourseView, lessonId: string | undefined): LessonView | undefined {
  return course.lessons.find((l) => l.id === lessonId)
}

/** Las imágenes de portada existen solo para los cursos que ya tienen una. */
export const covers: Record<string, string> = { m02: 'm02-cover' }

export function imageSrcSet(name: string): string {
  return [480, 960, 1600].map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')
}

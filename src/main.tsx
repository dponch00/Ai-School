import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import './styles/app.css'
import Layout from './app/Layout.tsx'
import Home from './pages/Home.tsx'
import Library from './pages/Library.tsx'
import CourseOverview from './pages/CourseOverview.tsx'
import LessonPage from './pages/LessonPage.tsx'
import NotFound from './pages/NotFound.tsx'

/**
 * Carga diferida: lo que se usa al leer (inicio, cursos, portada y lección) viaja en el paquete principal;
 * el resto se descarga al abrirlo. El SW precachea todos los fragmentos, así que también funcionan sin conexión.
 */
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default })

// Hash routing (D-014): funciona en hosting estático sin reescrituras y offline con un solo index.html.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cursos', element: <Library /> },
      { path: 'cursos/:courseId', element: <CourseOverview /> },
      { path: 'cursos/:courseId/lecciones/:lessonId', element: <LessonPage /> },
      { path: 'cursos/:courseId/laboratorio', lazy: page(() => import('./pages/LabPage.tsx')) },
      { path: 'cursos/:courseId/examen', lazy: page(() => import('./pages/ExamPage.tsx')) },
      { path: 'cursos/:courseId/practica', lazy: page(() => import('./pages/PracticePage.tsx')) },
      { path: 'cursos/:courseId/repaso', lazy: page(() => import('./pages/ErrorReviewPage.tsx')) },
      { path: 'diagnostico', lazy: page(() => import('./pages/DiagnosticPage.tsx')) },
      { path: 'buscar', lazy: page(() => import('./pages/SearchPage.tsx')) },
      { path: 'glosario', lazy: page(() => import('./pages/GlossaryPage.tsx')) },
      { path: 'notas', lazy: page(() => import('./pages/NotesPage.tsx')) },
      { path: 'respaldo', lazy: page(() => import('./pages/BackupPage.tsx')) },
      { path: 'como-funciona', lazy: page(() => import('./pages/HowItWorksPage.tsx')) },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

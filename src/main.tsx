import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import './styles/app.css'
import Layout from './app/Layout.tsx'
import Home from './pages/Home.tsx'
import Library from './pages/Library.tsx'
import CourseOverview from './pages/CourseOverview.tsx'
import LessonPage from './pages/LessonPage.tsx'
import LabPage from './pages/LabPage.tsx'
import ExamPage from './pages/ExamPage.tsx'
import PracticePage from './pages/PracticePage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import EvaluationPage from './pages/EvaluationPage.tsx'
import NotFound from './pages/NotFound.tsx'

// Hash routing (D-014): funciona en hosting estático sin reescrituras y offline con un solo index.html.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cursos', element: <Library /> },
      { path: 'cursos/:courseId', element: <CourseOverview /> },
      { path: 'cursos/:courseId/lecciones/:lessonId', element: <LessonPage /> },
      { path: 'cursos/:courseId/laboratorio', element: <LabPage /> },
      { path: 'cursos/:courseId/examen', element: <ExamPage /> },
      { path: 'cursos/:courseId/practica', element: <PracticePage /> },
      { path: 'perfil', element: <ProfilePage /> },
      { path: 'evaluacion', element: <EvaluationPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

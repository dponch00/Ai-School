import { useEffect, useState } from 'react'
import { routeHint } from './readingRoute'

type ReaderProgressProps = {
  courseId: string
  currentLesson: number
  lessonCount: number
  targetId: string
  kind: 'lesson' | 'lab'
  ready: boolean
}

const themeKey = 'ai-school-reading-theme'

type Theme = 'light' | 'dark'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function savedTheme(): Theme {
  try {
    const saved = localStorage.getItem(themeKey)
    return isTheme(saved) ? saved : 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : ''
  const themeColor = document.querySelector('meta[name="theme-color"]')
  themeColor?.setAttribute('content', theme === 'dark' ? '#10191D' : '#172A33')
}

function readingPercent(target: HTMLElement) {
  const start = target.getBoundingClientRect().top + window.scrollY
  const range = target.offsetHeight - window.innerHeight
  if (range <= 0) return window.scrollY >= start ? 100 : 0
  const value = ((window.scrollY - start) / range) * 100
  return Math.round(Math.min(100, Math.max(0, value)))
}

export default function ReaderProgress({ courseId, currentLesson, lessonCount, targetId, kind, ready }: ReaderProgressProps) {
  const [percent, setPercent] = useState(0)
  const [theme, setTheme] = useState<Theme>(savedTheme)
  const [fullscreen, setFullscreen] = useState(() => document.fullscreenElement !== null)
  const [fullscreenAvailable] = useState(() => document.fullscreenEnabled)
  const [fullscreenMessage, setFullscreenMessage] = useState('')

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!ready) return
    const target = document.getElementById(targetId)
    if (!target) return
    const update = () => {
      const next = readingPercent(target)
      setPercent((current) => current === next ? current : next)
    }
    const frame = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(target)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ready, targetId])

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const changeTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(themeKey, next)
    } catch {
      // La lectura sigue funcionando aunque el navegador no permita guardar la preferencia.
    }
  }

  const toggleFullscreen = async () => {
    setFullscreenMessage('')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      setFullscreenMessage('El navegador no permitió la pantalla completa. Puedes seguir leyendo normalmente.')
    }
  }

  const step = kind === 'lab' ? lessonCount + 1 : currentLesson
  const steps = lessonCount + 2
  const label = kind === 'lab' ? 'Laboratorio' : `Lección ${currentLesson} de ${lessonCount}`

  return (
    <aside className="reader-progress" aria-label="Progreso de lectura">
      <div className="reader-progress__summary">
        <span className="reader-progress__course">{courseId.toUpperCase()} · {label}</span>
        <span className="reader-progress__percent">{percent}% leído</span>
      </div>
      <progress className="reader-progress__bar" value={percent} max="100" aria-label={`Progreso de lectura: ${percent}%`} />
      <p className="reader-progress__route">Ruta {step} de {steps} · {routeHint(kind, currentLesson, lessonCount)}</p>
      <div className="reader-progress__controls">
        <button className="button button--small reader-progress__control" type="button" onClick={changeTheme} aria-pressed={theme === 'dark'}>
          {theme === 'dark' ? '☀ Lectura clara' : '☾ Lectura oscura'}
        </button>
        {fullscreenAvailable && (
          <button className="button button--small reader-progress__control" type="button" onClick={toggleFullscreen} aria-pressed={fullscreen}>
            {fullscreen ? '× Salir de pantalla completa' : '⛶ Pantalla completa'}
          </button>
        )}
      </div>
      {fullscreenMessage && <p className="reader-progress__message" role="status">{fullscreenMessage}</p>}
    </aside>
  )
}

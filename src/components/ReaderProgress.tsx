import { useEffect, useState } from 'react'
import { routeHint } from './readingRoute'

type ReaderProgressProps = {
  courseId: string
  currentLesson: number
  lessonCount: number
  targetId: string
  kind: 'lesson' | 'lab'
  ready: boolean
  placement: 'inline' | 'side'
}

function readingPercent(target: HTMLElement) {
  const start = target.getBoundingClientRect().top + window.scrollY
  const range = target.offsetHeight - window.innerHeight
  if (range <= 0) return window.scrollY >= start ? 100 : 0
  const value = ((window.scrollY - start) / range) * 100
  return Math.round(Math.min(100, Math.max(0, value)))
}

export default function ReaderProgress({ courseId, currentLesson, lessonCount, targetId, kind, ready, placement }: ReaderProgressProps) {
  const [percent, setPercent] = useState(0)

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

  const step = kind === 'lab' ? lessonCount + 1 : currentLesson
  const steps = lessonCount + 2
  const label = kind === 'lab' ? 'Laboratorio' : `Lección ${currentLesson} de ${lessonCount}`

  return (
    <aside className={`reader-progress reader-progress--${placement}`} aria-label="Progreso de lectura">
      <div className="reader-progress__summary">
        <span className="reader-progress__course">{courseId.toUpperCase()} · {label}</span>
        <span className="reader-progress__percent">{percent}% leído</span>
      </div>
      <progress className="reader-progress__bar" value={percent} max="100" aria-label={`Progreso de lectura: ${percent}%`} />
      <p className="reader-progress__route">Ruta {step} de {steps} · {routeHint(kind, currentLesson, lessonCount)}</p>
    </aside>
  )
}

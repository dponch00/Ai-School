import { useId, useState } from 'react'
import { Link } from 'react-router'
import type { Question } from '../domain/content'

interface Props {
  question: Question
  courseId: string
  /** Lección que se está leyendo: si el apartado es de esta lección, se desplaza en vez de navegar. */
  currentLessonId?: string
  label: string
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Comprobación de lección: feedback inmediato por opción (estándar §4.1).
 * Todavía no guarda la respuesta; la persistencia llega en F1-07.
 */
export default function QuestionCheck({ question, courseId, currentLessonId, label }: Props) {
  // Orden aleatorio salvo fixedOrder (estándar §4.4): se fija al montar para no reordenar al responder.
  const [options] = useState(() => (question.fixedOrder ? question.options : shuffle(question.options)))
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const groupId = useId()
  const [lessonId, anchor] = question.sectionRef.split('#')
  const sameLesson = lessonId === currentLessonId

  const submit = () => {
    if (!selected) {
      setError(true)
      return
    }
    setError(false)
    setSubmitted(true)
  }

  return (
    <fieldset className="question" aria-describedby={`${groupId}-scenario ${groupId}-stem`}>
      <legend className="question__label">{label}</legend>
      <p id={`${groupId}-scenario`} className="question__scenario">{question.scenario}</p>
      <p id={`${groupId}-stem`} className="question__stem">{question.stem}</p>
      <div className="question__options">
        {options.map((o) => {
          const state = submitted ? (o.correct ? 'correct' : o.id === selected ? 'wrong' : 'other') : 'open'
          return (
            <div key={o.id} className={`option option--${state}`}>
              <label className="option__label">
                <input
                  type="radio"
                  name={groupId}
                  value={o.id}
                  checked={selected === o.id}
                  disabled={submitted}
                  onChange={() => setSelected(o.id)}
                />
                <span>{o.text}</span>
              </label>
              {submitted && (o.correct || o.id === selected) && (
                <p className="option__feedback">
                  <strong>{o.correct ? '✓ Correcta. ' : '✗ No era la mejor opción. '}</strong>
                  {o.feedback.replace(/^Correcta\.\s*/, '')}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {error && <p className="question__error" role="alert">Elige una opción antes de comprobar.</p>}
      {!submitted ? (
        <button type="button" className="button" onClick={submit}>Comprobar</button>
      ) : (
        <p className="question__ref">
          {sameLesson ? (
            <a href={`#${anchor}`} data-scroll={anchor}>Repasar el apartado</a>
          ) : (
            <Link to={`/cursos/${courseId}/lecciones/${lessonId}?seccion=${anchor}`}>Repasar el apartado en su lección</Link>
          )}
        </p>
      )}
    </fieldset>
  )
}

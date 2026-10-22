import { useId, useState } from 'react'
import { Link } from 'react-router'
import type { Question } from '../domain/content'
import type { AnswerNotes } from '../storage/progress'

interface Props {
  question: Question
  courseId: string
  /** Lección que se está leyendo: si el apartado es de esta lección, se desplaza en vez de navegar. */
  currentLessonId?: string
  label: string
  /** Se llama una vez, al comprobar, con el orden de opciones que vio el alumno. */
  onAnswer?: (question: Question, shownOptionIds: string[], selectedOptionId: string, notes: AnswerNotes) => void
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
 * La respuesta se guarda a través de `onAnswer` (F1-07).
 */
export default function QuestionCheck({ question, courseId, currentLessonId, label, onAnswer }: Props) {
  // Orden aleatorio salvo fixedOrder (estándar §4.4): se fija al montar para no reordenar al responder.
  const [options] = useState(() => (question.fixedOrder ? question.options : shuffle(question.options)))
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [notes, setNotes] = useState<AnswerNotes>({})
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
    onAnswer?.(question, options.map((o) => o.id), selected, { ...notes, explanation: notes.explanation?.trim() || undefined })
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
      {!submitted && onAnswer && (
        <details className="question__notes">
          <summary>Antes de comprobar: explica tu elección (opcional)</summary>
          <label>¿Por qué elegiste esta respuesta?
            <textarea rows={3} maxLength={4000} value={notes.explanation ?? ''} onChange={(e) => setNotes({ ...notes, explanation: e.target.value })} />
          </label>
          <div className="question__notes-row">
            <label>Confianza
              <select value={notes.confidence ?? ''} onChange={(e) => setNotes({ ...notes, confidence: (e.target.value || undefined) as AnswerNotes['confidence'] })}>
                <option value="">Sin indicar</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </label>
            <label>Ayuda
              <select value={notes.declaredHelp ?? ''} onChange={(e) => setNotes({ ...notes, declaredHelp: (e.target.value || undefined) as AnswerNotes['declaredHelp'] })}>
                <option value="">Sin indicar</option>
                <option value="none">Sin ayuda</option>
                <option value="external-ai">Consulté una IA</option>
                <option value="other">Otra ayuda</option>
              </select>
            </label>
          </div>
          <p className="muted">Sirve para que un evaluador vea tu criterio, incluso cuando aciertas. Se guarda con tu respuesta.</p>
        </details>
      )}
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

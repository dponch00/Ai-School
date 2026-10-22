import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { APP_VERSION } from '../app/version'
import { content } from '../content'
import type { Practice } from '../domain/content'
import { EVALUATION_PROMPT, MAX_EVALUATOR_QUESTIONS, PROFILE_FIELDS, SECTIONS, buildReport, type ProfileField, type SectionKey } from '../report/build'
import { db } from '../storage/db'
import { loadRecord, saveReport, type LearnerRecord } from '../storage/learner'
import { newLocalId, now } from '../storage/progress'
import { useLive } from '../storage/useLive'

const ALL_SECTIONS = Object.fromEntries(Object.keys(SECTIONS).map((k) => [k, true])) as Record<SectionKey, boolean>

/** Preparar evaluación (plan §17.3): elegir alcance, ver qué se comparte y descargar el HTML. */
export default function EvaluationPage() {
  const record = useLive(() => loadRecord(db), [], null as LearnerRecord | null)
  const [kind, setKind] = useState<'course' | 'full'>('course')
  const [courseId, setCourseId] = useState(content.courses[0]?.id ?? '')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sections, setSections] = useState(ALL_SECTIONS)
  const [omitted, setOmitted] = useState<ProfileField[]>([])
  const [questions, setQuestions] = useState('')
  const [reportId, setReportId] = useState(() => `rep-${newLocalId().slice(0, 12)}`)
  const [stamp, setStamp] = useState(now)
  const [message, setMessage] = useState<string | null>(null)
  const [markdownFallback, setMarkdownFallback] = useState<string | null>(null)

  const ctx = useMemo(
    () => ({
      courses: content.courses.map((c) => ({ id: c.id, title: c.title, version: c.version })),
      competencies: content.competencies ?? {},
      practices: content.courses.map((c) => c.practice).filter((p): p is NonNullable<typeof p> => p !== null) as Practice[],
    }),
    [],
  )
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const profileFields = (Object.keys(PROFILE_FIELDS) as ProfileField[]).filter((f) => !omitted.includes(f))
  const scope = { kind, ...(kind === 'course' ? { courseId } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}) }

  const built = useMemo(
    () =>
      record
        ? buildReport(record, ctx, { reportId, generatedAt: stamp, timezone, appVersion: APP_VERSION, scope, profileFields, sections, questionsForEvaluator: questions })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [record, ctx, reportId, stamp, timezone, kind, courseId, from, to, omitted, sections, questions],
  )

  const filledFields = record?.profile
    ? (Object.keys(PROFILE_FIELDS) as ProfileField[]).filter((f) => {
        const v = f === 'priorEvidence' ? record.profile!.priorEvidence : (record.profile!.declared as Record<string, unknown>)[f]
        return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
      })
    : []

  const download = async () => {
    if (!built) return
    const blob = new Blob([built.html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = built.record.fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    try {
      await saveReport(db, built.record)
      setMessage(`Descargado ${built.record.fileName}. La app guardó su resumen para comparar con el próximo reporte.`)
    } catch {
      setMessage(`Descargado ${built.record.fileName}. No se pudo guardar su resumen en la app.`)
    }
    // El siguiente reporte es otro: nuevo ID y nuevo corte.
    setReportId(`rep-${newLocalId().slice(0, 12)}`)
    setStamp(now())
  }

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setMessage(`${what} copiado.`)
      setMarkdownFallback(null)
    } catch {
      setMarkdownFallback(text)
      setMessage('El navegador no dejó copiar. Selecciona el texto de abajo y cópialo a mano.')
    }
  }

  return (
    <div className="page page--reader">
      <article className="form-page">
        <h1>Preparar una evaluación</h1>
        <p className="lead">
          Arma un reporte con tus respuestas y evidencias para compartirlo en un chat con un evaluador. La app no envía nada: tú descargas el archivo y decides dónde adjuntarlo.
        </p>

        <fieldset className="form-group">
          <legend>1. Alcance</legend>
          <label className="radio"><input type="radio" name="scope" checked={kind === 'course'} onChange={() => setKind('course')} /> Un curso</label>
          {kind === 'course' && (
            <label>Curso
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                {content.courses.map((c) => <option key={c.id} value={c.id}>{c.id.toUpperCase()} · {c.title}</option>)}
              </select>
            </label>
          )}
          <label className="radio"><input type="radio" name="scope" checked={kind === 'full'} onChange={() => setKind('full')} /> Expediente completo disponible</label>
          <label className="radio radio--disabled"><input type="radio" name="scope" disabled /> Evaluación inicial (llega con el diagnóstico)</label>
          <div className="form-row">
            <label>Desde <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
            <label>Hasta <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
          </div>
        </fieldset>

        <fieldset className="form-group">
          <legend>2. Qué actividades incluir</legend>
          {(Object.keys(SECTIONS) as SectionKey[]).map((k) => (
            <label key={k} className="check">
              <input type="checkbox" checked={sections[k]} onChange={(e) => setSections({ ...sections, [k]: e.target.checked })} /> {SECTIONS[k]}
            </label>
          ))}
          <p className="muted">Tus explicaciones y la entrega del laboratorio van tal como las escribiste. Revisa la vista previa antes de compartir.</p>
        </fieldset>

        <fieldset className="form-group">
          <legend>3. Qué compartir de tu perfil</legend>
          {filledFields.length === 0 ? (
            <p className="muted">Tu perfil está vacío. <Link to="/perfil">Complétalo</Link> si quieres que el evaluador conozca tu contexto.</p>
          ) : (
            filledFields.map((f) => (
              <label key={f} className="check">
                <input type="checkbox" checked={!omitted.includes(f)} onChange={(e) => setOmitted(e.target.checked ? omitted.filter((x) => x !== f) : [...omitted, f])} /> {PROFILE_FIELDS[f]}
              </label>
            ))
          )}
        </fieldset>

        <fieldset className="form-group">
          <legend>4. Preguntas para el evaluador (opcional)</legend>
          <label>
            <span className="visually-hidden">Preguntas para el evaluador</span>
            <textarea rows={3} maxLength={MAX_EVALUATOR_QUESTIONS} value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder="Por ejemplo: ¿mi forma de registrar supuestos es suficiente para un dashboard financiero?" />
          </label>
          <p className="muted">{questions.length} de {MAX_EVALUATOR_QUESTIONS} caracteres.</p>
        </fieldset>

        {built && (
          <section className="preview" aria-labelledby="vista-previa">
            <h2 id="vista-previa">Vista previa</h2>
            <dl className="preview__facts">
              <dt>Fecha de corte</dt><dd>{new Date(stamp).toLocaleString('es')} ({timezone})</dd>
              <dt>Contenido</dt><dd>{built.record.counts.attempts} intentos, {built.record.counts.responses} respuestas, {built.record.counts.practices} entregas de laboratorio</dd>
              <dt>Cobertura</dt>
              <dd>{built.record.byCompetency.length === 0 ? 'Sin respuestas en este alcance' : built.record.byCompetency.map((c) => `${c.competencyId} (${c.total})`).join(', ')}</dd>
              <dt>Tamaño aproximado</dt><dd>{Math.ceil(new Blob([built.html]).size / 1024)} KB</dd>
            </dl>
            <h3>Lo que queda fuera</h3>
            {built.record.excluded.length === 0 ? <p>Nada dentro del alcance.</p> : <ul>{built.record.excluded.map((x) => <li key={x}>{x}</li>)}</ul>}
            <details>
              <summary>Ver el reporte completo</summary>
              <iframe className="preview__frame" title="Vista previa del reporte" sandbox="" srcDoc={built.html} />
            </details>
            <div className="actions">
              <button type="button" className="button button--primary" onClick={download}>Descargar HTML para el chat</button>
              <button type="button" className="button" onClick={() => copy(built.markdown, 'Contexto en Markdown')}>Copiar contexto en Markdown</button>
            </div>
            {message && <p role="status">{message}</p>}
            {markdownFallback && <textarea className="fallback" readOnly rows={8} value={markdownFallback} onFocus={(e) => e.currentTarget.select()} />}
          </section>
        )}

        <section className="section" aria-labelledby="instruccion">
          <h2 id="instruccion">Instrucción para el chat</h2>
          <p className="muted">Pégala junto con el archivo. El evaluador no recuerda reportes anteriores: cada uno trae lo necesario para entenderse solo.</p>
          <pre className="prompt-block">{EVALUATION_PROMPT}</pre>
          <button type="button" className="button" onClick={() => copy(EVALUATION_PROMPT, 'Instrucción')}>Copiar instrucción</button>
        </section>
      </article>
    </div>
  )
}

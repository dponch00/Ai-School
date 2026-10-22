import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { content } from '../content'
import { feedbackDiscrepancies, feedbackTemplate, parseFeedback, type ParsedFeedback } from '../domain/feedback'
import type { ExternalFeedback, PlanAdjustment } from '../domain/learner'
import { db } from '../storage/db'
import { loadRecord, type LearnerRecord } from '../storage/learner'
import { addAdjustment, registerFeedback, revertAdjustment, setAdjustmentState, type AdjustmentDraft } from '../storage/route'
import { useLive } from '../storage/useLive'

const KIND: Record<PlanAdjustment['kind'], string> = {
  'review-lesson': 'Repasar',
  reorder: 'Cambiar el orden',
  'extra-exercise': 'Ejercicio adicional',
  'new-topic': 'Tema nuevo',
  note: 'Nota',
}
const STATE: Record<PlanAdjustment['state'], string> = {
  proposed: 'Propuesta',
  accepted: 'Aceptada',
  'in-progress': 'En curso',
  done: 'Completada',
  postponed: 'Pospuesta',
  discarded: 'Descartada',
}
const MAX_FEEDBACK = 100000
const date = (iso: string) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })

/** Mi ruta (plan §17.6–17.7): registrar la retroalimentación de un evaluador y convertirla en acciones. */
export default function RoutePage() {
  const record = useLive(() => loadRecord(db), [], null as LearnerRecord | null)
  if (!record) return null
  return (
    <div className="page page--reader">
      <article className="form-page">
        <h1>Mi ruta</h1>
        <p className="lead">Aquí registras lo que te dijo un evaluador y decides qué hacer con ello. Nada se aplica solo: cada propuesta la aceptas, la pospones o la descartas tú.</p>
        <FeedbackForm record={record} />
        <Adjustments record={record} />
        <ManualAdjustment />
        <FeedbackHistory feedback={record.feedback} />
      </article>
    </div>
  )
}

function useKnownTargets() {
  return useMemo(() => {
    const lessons = content.courses.flatMap((c) => c.lessons.map((l) => ({ id: l.id, label: `${c.id.toUpperCase()} · L${l.order} ${l.title}` })))
    const ids = new Set<string>([...lessons.map((l) => l.id), ...content.courses.map((c) => c.id), ...Object.keys(content.competencies ?? {})])
    return { lessons, ids }
  }, [])
}

function FeedbackForm({ record }: { record: LearnerRecord }) {
  const reports = [...record.reports].reverse()
  const known = useKnownTargets()
  const [reportId, setReportId] = useState(reports[0]?.id ?? '')
  const [name, setName] = useState('')
  const [type, setType] = useState<ExternalFeedback['reviewer']['reviewType']>('external-assisted')
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState<ParsedFeedback | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  if (reports.length === 0) {
    return (
      <section className="form-group" aria-labelledby="registrar">
        <h2 id="registrar">Registrar una retroalimentación</h2>
        <p>Primero <Link to="/evaluacion">genera un reporte de evaluación</Link> y compártelo con un evaluador. La retroalimentación siempre se liga al reporte que evaluó.</p>
      </section>
    )
  }

  const discrepancies =
    parsed?.kind === 'structured'
      ? feedbackDiscrepancies(parsed.data, { reportIds: new Set(record.reports.map((r) => r.id)), targetIds: known.ids, competencyIds: new Set(Object.keys(content.competencies ?? {})) }, reportId)
      : []

  const save = async () => {
    try {
      const r = await registerFeedback(db, {
        sourceReportId: reportId,
        reviewer: { declaredName: name.trim(), reviewType: type },
        fullText: text,
        structured: parsed?.kind === 'structured' ? parsed.data : undefined,
      })
      setMessage(
        r.created
          ? `Registrada.${r.proposals > 0 ? ` Se crearon ${r.proposals} propuesta(s) en tu ruta; revísalas abajo.` : ''} Tus respuestas y calificaciones no cambian.`
          : 'Esta retroalimentación ya estaba registrada; no se duplicó nada.',
      )
      setParsed(null)
      if (r.created) setText('')
    } catch (e) {
      setMessage(`No se pudo registrar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <section className="form-group" aria-labelledby="registrar">
      <h2 id="registrar">Registrar una retroalimentación</h2>
      <label>Reporte que evaluó
        <select value={reportId} onChange={(e) => { setReportId(e.target.value); setParsed(null) }}>
          {reports.map((r) => <option key={r.id} value={r.id}>{date(r.createdAt)} · {r.scope.kind === 'course' ? r.scope.courseId?.toUpperCase() : 'expediente completo'} · {r.id}</option>)}
        </select>
      </label>
      <div className="form-row">
        <label>Quién evaluó <input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la herramienta o de la persona" /></label>
        <label>Tipo
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="external-assisted">Herramienta de IA</option>
            <option value="human">Persona</option>
          </select>
        </label>
      </div>
      <label>Texto completo <small>({text.length} de {MAX_FEEDBACK.toLocaleString('es')} caracteres; se guarda tal cual y no se ejecuta nada)</small>
        <textarea rows={8} maxLength={MAX_FEEDBACK} value={text} onChange={(e) => { setText(e.target.value); setParsed(null) }} />
      </label>
      <details className="model-answer">
        <summary>Opcional: pedir al evaluador un bloque con recomendaciones</summary>
        <p>Si al final de su respuesta el evaluador agrega este bloque (relleno), la app convierte sus recomendaciones en propuestas. Sin él, igual se guarda el texto.</p>
        <pre className="prompt-block">{feedbackTemplate(reportId)}</pre>
      </details>
      {!parsed ? (
        <button type="button" className="button" disabled={!text.trim() || !name.trim()} onClick={() => setParsed(parseFeedback(text))}>Revisar antes de registrar</button>
      ) : (
        <div className="notice notice--info" role="status">
          {parsed.kind === 'text' && <p>Se guardará como texto. No trae un bloque de recomendaciones, así que no se crearán propuestas.</p>}
          {parsed.kind === 'invalid' && <p>El bloque de recomendaciones no es válido ({parsed.reason}). Se guardará solo el texto y no se aplicará nada.</p>}
          {parsed.kind === 'structured' && (
            <>
              <p>Trae {parsed.data.observations.length} observación(es) y {parsed.data.recommendations.length} recomendación(es), que entrarán como propuestas.</p>
              {discrepancies.length > 0 && (
                <>
                  <p className="notice__title">Revisa esto antes de registrar</p>
                  <ul>{discrepancies.map((d) => <li key={d}>{d}</li>)}</ul>
                </>
              )}
            </>
          )}
          <div className="actions">
            <button type="button" className="button button--primary" onClick={save}>Registrar</button>
            <button type="button" className="button" onClick={() => setParsed(null)}>Volver a editar</button>
          </div>
        </div>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  )
}

function Adjustments({ record }: { record: LearnerRecord }) {
  const known = useKnownTargets()
  const lessonLink = (id: string) => {
    const course = content.courses.find((c) => c.lessons.some((l) => l.id === id))
    const label = known.lessons.find((l) => l.id === id)?.label ?? id
    return course ? <Link key={id} to={`/cursos/${course.id}/lecciones/${id}`}>{label}</Link> : <span key={id}>{id}</span>
  }
  const feedbackBy = new Map(record.feedback.map((f) => [f.id, f]))
  const groups: [string, PlanAdjustment['state'][]][] = [
    ['Propuestas por revisar', ['proposed']],
    ['En tu ruta', ['accepted', 'in-progress']],
    ['Cerradas', ['done', 'postponed', 'discarded']],
  ]
  const act = (id: string, state: PlanAdjustment['state']) => setAdjustmentState(db, id, state).catch((e) => console.warn(e))
  const sorted = [...record.adjustments].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <section className="section" aria-labelledby="ajustes">
      <h2 id="ajustes">Propuestas y ajustes</h2>
      {sorted.length === 0 && <p className="muted">Todavía no hay ajustes. Llegarán con una retroalimentación estructurada, o puedes agregar uno abajo.</p>}
      {groups.map(([title, states]) => {
        const items = sorted.filter((a) => states.includes(a.state))
        if (items.length === 0) return null
        const body = items.map((a) => (
          <div key={a.id} className="adjustment">
            <p className="adjustment__meta">
              <span className="badge">{KIND[a.kind]}</span> {STATE[a.state]} · {a.origin === 'recommendation' ? `recomendación de ${feedbackBy.get(a.feedbackId ?? '')?.reviewer.declaredName ?? 'un evaluador'}` : 'ajuste tuyo'} · {date(a.createdAt)}
            </p>
            <p className="adjustment__change">{a.change}</p>
            {a.targetIds.length > 0 && <p className="muted">Sobre: {a.targetIds.map((t, i) => <span key={t}>{i > 0 && ', '}{lessonLink(t)}</span>)}</p>}
            {a.reason && <p className="muted">Motivo: {a.reason}</p>}
            {a.successCriterion && <p className="muted">Cómo sabrás que lo lograste: {a.successCriterion}</p>}
            <div className="actions">
              {a.state === 'proposed' && <button type="button" className="button button--primary" onClick={() => act(a.id, 'accepted')}>Aceptar</button>}
              {a.state === 'accepted' && <button type="button" className="button" onClick={() => act(a.id, 'in-progress')}>Empezar</button>}
              {(a.state === 'accepted' || a.state === 'in-progress') && <button type="button" className="button" onClick={() => act(a.id, 'done')}>Completar</button>}
              {(a.state === 'proposed' || a.state === 'accepted' || a.state === 'in-progress') && <button type="button" className="button" onClick={() => act(a.id, 'postponed')}>Posponer</button>}
              {(a.state === 'proposed' || a.state === 'accepted' || a.state === 'postponed') && <button type="button" className="button" onClick={() => act(a.id, 'discarded')}>Descartar</button>}
              {a.history.length > 1 && <button type="button" className="button" onClick={() => revertAdjustment(db, a.id).catch((e) => console.warn(e))}>Deshacer último cambio</button>}
            </div>
          </div>
        ))
        return states.includes('done') ? (
          <details key={title} className="model-answer"><summary>{title} ({items.length})</summary>{body}</details>
        ) : (
          <div key={title}><h3>{title}</h3>{body}</div>
        )
      })}
    </section>
  )
}

function ManualAdjustment() {
  const known = useKnownTargets()
  const empty: AdjustmentDraft = { kind: 'review-lesson', targetIds: [], change: '', reason: '' }
  const [draft, setDraft] = useState<AdjustmentDraft>(empty)
  const [message, setMessage] = useState<string | null>(null)
  const save = async () => {
    try {
      await addAdjustment(db, { ...draft, change: draft.change.trim(), reason: draft.reason.trim(), successCriterion: draft.successCriterion?.trim() || undefined })
      setDraft(empty)
      setMessage('Agregado a tu ruta.')
    } catch (e) {
      setMessage(`No se pudo agregar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  return (
    <section className="form-group" aria-labelledby="manual">
      <h2 id="manual">Agregar un ajuste propio</h2>
      <p className="muted">Personaliza tu ruta: un repaso, un ejercicio extra, un tema que te interesa o una nota. No cambia los manuales oficiales; si quieres proponer un cambio a un manual, anótalo como nota.</p>
      <div className="form-row">
        <label>Tipo
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as AdjustmentDraft['kind'] })}>
            {Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label>Lección relacionada
          <select value={draft.targetIds[0] ?? ''} onChange={(e) => setDraft({ ...draft, targetIds: e.target.value ? [e.target.value] : [] })}>
            <option value="">Ninguna</option>
            {known.lessons.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </label>
      </div>
      <label>Qué vas a hacer <textarea rows={2} maxLength={4000} value={draft.change} onChange={(e) => setDraft({ ...draft, change: e.target.value })} /></label>
      <label>Por qué <textarea rows={2} maxLength={2000} value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} /></label>
      <label>Cómo sabrás que lo lograste <small>(opcional)</small> <textarea rows={2} maxLength={2000} value={draft.successCriterion ?? ''} onChange={(e) => setDraft({ ...draft, successCriterion: e.target.value })} /></label>
      <button type="button" className="button button--primary" disabled={!draft.change.trim()} onClick={save}>Agregar a mi ruta</button>
      {message && <p role="status">{message}</p>}
    </section>
  )
}

function FeedbackHistory({ feedback }: { feedback: ExternalFeedback[] }) {
  if (feedback.length === 0) return null
  return (
    <section className="section" aria-labelledby="historial">
      <h2 id="historial">Retroalimentación registrada</h2>
      <p className="muted">Es evaluación externa: una opinión con evidencia, no una calificación oficial.</p>
      {[...feedback].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).map((f) => (
        <details key={f.id} className="model-answer">
          <summary>{date(f.receivedAt)} · {f.reviewer.declaredName} ({f.reviewer.reviewType === 'human' ? 'persona' : 'herramienta de IA'}) · reporte {f.sourceReportId}</summary>
          <pre className="prompt-block">{f.fullText}</pre>
        </details>
      ))}
    </section>
  )
}

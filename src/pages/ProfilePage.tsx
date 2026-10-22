import { useState } from 'react'
import { Link } from 'react-router'
import BackupPanel from '../components/BackupPanel'
import { content } from '../content'
import type { Profile } from '../domain/learner'
import { db } from '../storage/db'
import { getProfile, saveProfile } from '../storage/learner'
import { useLive } from '../storage/useLive'

type Declared = Profile['declared']
type Level = Declared['selfAssessment'][number]['level']

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean)
const empty: Declared = { goals: [], projects: [], tools: [], selfAssessment: [], constraints: [] }

/** Perfil de aprendizaje (plan §17.1): todo es lo que Daniel declara; nada se rellena por él. */
export default function ProfilePage() {
  // El formulario se monta cuando ya se leyó lo guardado, para arrancar con esos valores.
  const loaded = useLive(async () => ({ stored: await getProfile(db) }), [], null as { stored?: Profile } | null)
  return loaded ? <ProfileForm stored={loaded.stored} /> : null
}

function ProfileForm({ stored }: { stored?: Profile }) {
  const [form, setForm] = useState<Declared>(stored?.declared ?? empty)
  const [evidence, setEvidence] = useState<Profile['priorEvidence']>(stored?.priorEvidence ?? [])
  const [status, setStatus] = useState<string | null>(null)

  const competencies = Object.values(content.competencies ?? {})
  const set = <K extends keyof Declared>(k: K, v: Declared[K]) => setForm((f) => ({ ...f, [k]: v }))
  const level = (id: string) => form.selfAssessment.find((s) => s.competencyId === id)
  const setLevel = (id: string, value: Level | '', note?: string) =>
    set(
      'selfAssessment',
      value === ''
        ? form.selfAssessment.filter((s) => s.competencyId !== id)
        : [...form.selfAssessment.filter((s) => s.competencyId !== id), { competencyId: id, level: value, ...(note ? { note } : {}) }],
    )

  const save = async () => {
    try {
      const clean: Declared = {
        ...form,
        alias: form.alias?.trim() || undefined,
        professionalContext: form.professionalContext?.trim() || undefined,
        preferences: form.preferences?.trim() || undefined,
      }
      await saveProfile(db, { declared: clean, priorEvidence: evidence.filter((x) => x.source.trim() && x.summary.trim()) })
      setStatus('Perfil guardado.')
    } catch (e) {
      setStatus(`No se pudo guardar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <div className="page page--reader">
      <article className="form-page">
        <h1>Mi perfil de aprendizaje</h1>
        <p className="lead">Lo que escribas aquí es lo que declaras tú. El reporte de evaluación lo separa de lo que la app observa en tus respuestas, y tú eliges qué campos compartir cada vez.</p>
        <div className="notice notice--warning">
          <p className="notice__title">Antes de escribir</p>
          <p>Limítate a tu aprendizaje. No escribas nombres de tu empresa o de clientes, cifras reales, rutas internas ni credenciales: estos textos pueden terminar en un reporte que compartas. Todo se guarda solo en este navegador.</p>
        </div>

        <fieldset className="form-group">
          <legend>Quién eres y qué buscas</legend>
          <label>Nombre o alias <input value={form.alias ?? ''} maxLength={80} onChange={(e) => set('alias', e.target.value)} /></label>
          <label>Contexto profesional relevante <small>(hasta 2 000 caracteres)</small>
            <textarea rows={3} maxLength={2000} value={form.professionalContext ?? ''} onChange={(e) => set('professionalContext', e.target.value)} placeholder="Por ejemplo: trabajo en finanzas y quiero dirigir agentes para construir herramientas de análisis." />
          </label>
          <label>Objetivos de aprendizaje <small>(uno por línea)</small>
            <textarea rows={3} value={form.goals.join('\n')} onChange={(e) => set('goals', lines(e.target.value).slice(0, 20).map((x) => x.slice(0, 500)))} />
          </label>
          <label>Proyectos donde lo vas a aplicar <small>(uno por línea, descritos en general)</small>
            <textarea rows={2} value={form.projects.join('\n')} onChange={(e) => set('projects', lines(e.target.value).slice(0, 20).map((x) => x.slice(0, 300)))} />
          </label>
        </fieldset>

        <fieldset className="form-group">
          <legend>Cómo trabajas</legend>
          <label>Herramientas que usas <small>(una por línea)</small>
            <textarea rows={2} value={form.tools.join('\n')} onChange={(e) => set('tools', lines(e.target.value).slice(0, 30).map((x) => x.slice(0, 200)))} />
          </label>
          <label>Cómo prefieres que te expliquen
            <textarea rows={2} maxLength={2000} value={form.preferences ?? ''} onChange={(e) => set('preferences', e.target.value)} placeholder="Ejemplos concretos, poco texto, en español…" />
          </label>
          <label>Minutos de estudio por semana
            <input type="number" min={1} max={10000} inputMode="numeric" value={form.weeklyMinutes ?? ''} onChange={(e) => set('weeklyMinutes', e.target.value ? Math.max(1, Math.round(Number(e.target.value))) : undefined)} />
          </label>
          <label>Restricciones <small>(una por línea; por ejemplo «solo datos sintéticos»)</small>
            <textarea rows={2} value={form.constraints.join('\n')} onChange={(e) => set('constraints', lines(e.target.value).slice(0, 20).map((x) => x.slice(0, 300)))} />
          </label>
        </fieldset>

        <fieldset className="form-group">
          <legend>Tu autoevaluación por competencia</legend>
          <p className="muted">Opcional. Es tu percepción, no un resultado: el reporte la muestra aparte de lo observado.</p>
          {competencies.map((c) => (
            <div key={c.id} className="self-row">
              <label>
                <span>{c.id} · {c.name}</span>
                <select value={level(c.id)?.level ?? ''} onChange={(e) => setLevel(c.id, e.target.value as Level | '', level(c.id)?.note)}>
                  <option value="">Sin indicar</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </label>
            </div>
          ))}
        </fieldset>

        <fieldset className="form-group">
          <legend>Evidencia previa externa a la app</legend>
          <p className="muted">Por ejemplo, un programa que ya cursaste. Escribe un resumen de lo aprendido, sin rutas, código ni datos de proyectos reales.</p>
          {evidence.map((x, i) => (
            <div key={i} className="evidence-row">
              <label>Origen <input maxLength={200} value={x.source} onChange={(e) => setEvidence(evidence.map((y, j) => (j === i ? { ...y, source: e.target.value } : y)))} /></label>
              <label>Fecha <input type="date" value={x.date} onChange={(e) => setEvidence(evidence.map((y, j) => (j === i ? { ...y, date: e.target.value } : y)))} /></label>
              <label>Resumen <textarea rows={2} maxLength={2000} value={x.summary} onChange={(e) => setEvidence(evidence.map((y, j) => (j === i ? { ...y, summary: e.target.value } : y)))} /></label>
              <button type="button" className="button" onClick={() => setEvidence(evidence.filter((_, j) => j !== i))}>Quitar</button>
            </div>
          ))}
          <button type="button" className="button" onClick={() => setEvidence([...evidence, { source: '', date: new Date().toISOString().slice(0, 10), summary: '' }])}>Agregar evidencia previa</button>
        </fieldset>

        <button type="button" className="button button--primary" onClick={save}>Guardar perfil</button>
        {status && <p role="status">{status}</p>}
        {stored && <p className="muted">Última actualización: {new Date(stored.updatedAt).toLocaleString('es')}. ID local: {stored.localId}.</p>}
        <p><Link to="/evaluacion">Preparar un reporte de evaluación →</Link></p>
        <BackupPanel />
      </article>
    </div>
  )
}

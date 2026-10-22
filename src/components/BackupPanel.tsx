import { useEffect, useState } from 'react'
import { APP_VERSION } from '../app/version'
import { content } from '../content'
import type { Backup } from '../domain/learner'
import { backupFileName, backupSummary, exportBackup, readBackupFile, restoreBackup } from '../storage/backup'
import { db } from '../storage/db'
import { checkStorage, requestPersistence, type StorageHealth } from '../storage/health'

/** Exportar e importar el respaldo completo (F1-10). Restaurar pide confirmación porque reemplaza todo. */
export default function BackupPanel() {
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<Backup | null>(null)
  const [health, setHealth] = useState<StorageHealth | null>(null)
  useEffect(() => {
    void checkStorage(db).then(setHealth)
  }, [])

  const persist = async () => {
    const granted = await requestPersistence()
    setMessage(granted === null ? 'Este navegador no permite pedirlo.' : granted ? 'Listo: el navegador no borrará tus datos para liberar espacio.' : 'El navegador no lo concedió. Mantén un respaldo reciente.')
    setHealth(await checkStorage(db))
  }

  const exportNow = async () => {
    try {
      const b = await exportBackup(db, APP_VERSION, Object.fromEntries(content.courses.map((c) => [c.id, c.version])))
      const url = URL.createObjectURL(new Blob([JSON.stringify(b, null, 2)], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = backupFileName(b.exportedAt)
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage(`Respaldo descargado: ${a.download}. Guárdalo fuera del navegador.`)
    } catch (e) {
      setMessage(`No se pudo exportar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const pick = async (file: File | undefined) => {
    setPending(null)
    if (!file) return
    try {
      setPending(await readBackupFile(file))
      setMessage(null)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e))
    }
  }

  const restore = async () => {
    if (!pending) return
    try {
      await restoreBackup(db, pending)
      setMessage('Respaldo restaurado. Lo que había antes en este navegador se reemplazó.')
      setPending(null)
    } catch (e) {
      setMessage(`No se pudo restaurar: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const s = pending ? backupSummary(pending) : null
  return (
    <section className="form-group" aria-labelledby="respaldo">
      <h2 id="respaldo">Respaldo</h2>
      <p className="muted">Tu expediente vive solo en este navegador. Si borras los datos del sitio o cambias de dispositivo, se pierde, salvo que tengas un respaldo.</p>
      {health && (
        <p className="muted">
          {health.available ? 'Tu progreso se guarda en este navegador' : 'Este navegador no está guardando tu progreso'}
          {health.usageBytes !== null && health.quotaBytes ? ` · ocupa ${Math.max(1, Math.round(health.usageBytes / 1024))} KB` : ''}
          {health.persisted === true ? ' · protegido contra el borrado automático.' : health.persisted === false ? ' · el navegador podría borrarlo si le falta espacio.' : '.'}
        </p>
      )}
      {health?.persisted === false && (
        <button type="button" className="button" onClick={persist}>Pedir que no se borre</button>
      )}
      <button type="button" className="button" onClick={exportNow}>Exportar respaldo completo</button>
      <label>Restaurar desde un archivo
        <input type="file" accept="application/json,.json" onChange={(e) => pick(e.target.files?.[0])} />
      </label>
      {s && (
        <div className="notice notice--warning">
          <p className="notice__title">¿Restaurar este respaldo?</p>
          <p>
            Exportado el {new Date(s.exportedAt).toLocaleString('es')} (app {s.appVersion}): {s.hasProfile ? 'con perfil' : 'sin perfil'}, {s.attempts} intentos, {s.responses} respuestas, {s.practiceSubmissions} entregas, {s.feedback} retroalimentaciones y {s.reports} reportes.
          </p>
          <p>Reemplaza todo lo que hay guardado en este navegador. Si quieres conservarlo, exporta primero un respaldo.</p>
          <div className="actions">
            <button type="button" className="button button--primary" onClick={restore}>Sí, restaurar</button>
            <button type="button" className="button" onClick={() => setPending(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  )
}

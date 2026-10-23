import BackupPanel from '../components/BackupPanel'

/** Respaldo del progreso (D-024): lo único que queda de la antigua pantalla de perfil. */
export default function BackupPage() {
  return (
    <div className="page page--reader">
      <article className="form-page">
        <h1>Respaldo</h1>
        <p className="lead">Guarda una copia de tu progreso fuera del navegador para no perderlo y para seguir en otro dispositivo.</p>
        <BackupPanel />
      </article>
    </div>
  )
}

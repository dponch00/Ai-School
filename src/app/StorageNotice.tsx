import { useEffect, useState } from 'react'
import { db } from '../storage/db'
import { checkStorage } from '../storage/health'

/** Aviso global si el navegador no deja guardar (F2-09): se puede leer, pero no se guarda nada. */
export default function StorageNotice() {
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => {
    let alive = true
    void checkStorage(db).then((h) => {
      if (alive) setUnavailable(!h.available)
    })
    return () => {
      alive = false
    }
  }, [])
  if (!unavailable) return null
  return (
    <div className="update-prompt update-prompt--warning" role="alert">
      <p>
        Este navegador no deja guardar tu progreso (puede ser navegación privada o datos del sitio bloqueados). Puedes leer las lecciones, pero tus respuestas y tu avance no se guardarán.
      </p>
    </div>
  )
}

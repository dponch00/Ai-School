import { useEffect, useState } from 'react'
import { applyTheme, savedTheme, saveTheme, type Theme } from './appearance'

export default function AppearanceControls() {
  const [theme, setTheme] = useState<Theme>(savedTheme)
  const [fullscreen, setFullscreen] = useState(() => document.fullscreenElement !== null)
  const [fullscreenAvailable] = useState(() => document.fullscreenEnabled)
  const [status, setStatus] = useState('')

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const changeTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  const toggleFullscreen = async () => {
    setStatus('')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      setStatus('El navegador no permitió la pantalla completa.')
    }
  }

  return (
    <div className="appearance-controls" aria-label="Preferencias de visualización">
      <button
        className="appearance-controls__button"
        type="button"
        onClick={changeTheme}
        aria-label={theme === 'dark' ? 'Usar lectura clara' : 'Usar lectura oscura'}
        aria-pressed={theme === 'dark'}
        title={theme === 'dark' ? 'Lectura clara' : 'Lectura oscura'}
      >
        <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      </button>
      {fullscreenAvailable && (
        <button
          className="appearance-controls__button"
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          aria-pressed={fullscreen}
          title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          <span aria-hidden="true">{fullscreen ? '×' : '⛶'}</span>
        </button>
      )}
      {status && <span className="visually-hidden" role="status">{status}</span>}
    </div>
  )
}

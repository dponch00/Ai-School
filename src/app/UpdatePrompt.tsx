import { useRegisterSW } from 'virtual:pwa-register/react'

const HOUR_MS = 60 * 60 * 1000

/**
 * Aviso de versión nueva y de app lista sin conexión (F2-04). La actualización solo ocurre si Daniel
 * la acepta: nunca a mitad de una lección o un examen. Las respuestas ya están guardadas, así que
 * actualizar no pierde nada.
 */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Busca versiones nuevas cada hora mientras la app está abierta.
      if (registration) setInterval(() => void registration.update(), HOUR_MS)
    },
  })

  if (!needRefresh && !offlineReady) return null
  return (
    <div className="update-prompt" role="status">
      {needRefresh ? (
        <>
          <p>Hay una versión nueva de AI School. Tus respuestas están guardadas; puedes actualizar cuando termines lo que estás haciendo.</p>
          <div className="actions">
            <button type="button" className="button button--primary" onClick={() => void updateServiceWorker(true)}>Actualizar ahora</button>
            <button type="button" className="button" onClick={() => setNeedRefresh(false)}>Más tarde</button>
          </div>
        </>
      ) : (
        <>
          <p>La app ya funciona sin conexión en este dispositivo.</p>
          <div className="actions">
            <button type="button" className="button" onClick={() => setOfflineReady(false)}>Entendido</button>
          </div>
        </>
      )}
    </div>
  )
}

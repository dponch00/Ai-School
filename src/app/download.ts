/**
 * Guarda un archivo generado por la app (reporte HTML o respaldo JSON).
 *
 * En un navegador normal usa un enlace con `download`. La versión de prueba en un solo archivo corre dentro
 * del visor de claude.ai, que no permite ese enlace: `scripts/build-single.py` define `window.__aisSaveFile`,
 * que pide confirmación al usuario por la capacidad `downloads` del visor. Así la app sabe si el archivo
 * se guardó de verdad y no anuncia una descarga que el usuario rechazó (T022-03).
 */
export type SaveOutcome = 'saved' | 'declined' | 'unavailable'

declare global {
  interface Window {
    __aisSaveFile?: (filename: string, blob: Blob) => Promise<SaveOutcome>
  }
}

export async function saveFile(filename: string, blob: Blob): Promise<SaveOutcome> {
  if (window.__aisSaveFile) return window.__aisSaveFile(filename, blob)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'saved'
}

/** Mensaje para cuando el archivo no se guardó. */
export const notSavedMessage = (outcome: Exclude<SaveOutcome, 'saved'>) =>
  outcome === 'declined'
    ? 'No se descargó: rechazaste la confirmación. Puedes intentarlo otra vez.'
    : 'No se descargó: esta vista no permite guardar archivos. Abre la app en el navegador o usa «Copiar contexto en Markdown».'

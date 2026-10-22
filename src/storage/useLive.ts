// Las dependencias las decide quien llama, como en useEffect; el linter no puede verificarlas.
/* oxlint-disable react-hooks/exhaustive-deps */
import { liveQuery } from 'dexie'
import { useEffect, useState } from 'react'

/**
 * Consulta reactiva: se vuelve a ejecutar cuando cambian las tablas que lee.
 * Si IndexedDB no está disponible (navegación privada, sandbox), devuelve el valor inicial
 * y la app sigue funcionando sin guardar.
 */
export function useLive<T>(query: () => Promise<T>, deps: unknown[], initial: T): T {
  const [value, setValue] = useState<T>(initial)
  useEffect(() => {
    const sub = liveQuery(query).subscribe({
      next: setValue,
      error: (e) => console.warn('No se pudo leer el progreso guardado', e),
    })
    return () => sub.unsubscribe()
  }, deps)
  return value
}

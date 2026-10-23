// Sustituto de `virtual:pwa-register/react` en el build de un solo archivo (AIS_SINGLE=1), que no tiene SW.
import { useState } from 'react'

export function useRegisterSW(_options?: unknown) {
  const needRefresh = useState(false)
  const offlineReady = useState(false)
  return { needRefresh, offlineReady, updateServiceWorker: async (_reload?: boolean) => {} }
}

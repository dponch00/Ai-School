/// <reference lib="webworker" />
/**
 * Service worker de AI School (F2-04, D-014): precachea el shell (app, estilos, contenido compilado,
 * fuentes e imágenes para el celular) y sirve la app sin conexión.
 *
 * La actualización nunca es automática (registerType 'prompt'): el SW nuevo espera hasta que la app
 * le manda SKIP_WAITING, cuando Daniel acepta el aviso. Así no se recarga a mitad de un examen; y aunque
 * se recargue, las respuestas ya están guardadas en IndexedDB.
 */
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Rutas con hash: toda navegación del mismo origen vuelve al index precacheado.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') void self.skipWaiting()
})

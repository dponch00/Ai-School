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
import { ExpirationPlugin } from 'workbox-expiration'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Rutas con hash: toda navegación del mismo origen vuelve al index precacheado.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

// Paquetes por curso (F2-05): fuera del precache; se guardan al abrir o descargar el curso. El nombre lleva
// el hash del contenido, así que una versión nueva es otro archivo y las viejas se depuran solas.
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith(new URL('courses/', self.registration.scope).pathname),
  new CacheFirst({ cacheName: 'ais-courses', plugins: [new ExpirationPlugin({ maxEntries: 20 })] }),
)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') void self.skipWaiting()
})

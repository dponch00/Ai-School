import type { MouseEvent } from 'react'

/** Desplaza a un ancla interna: con hash routing, los enlaces #id no pueden navegar solos. */
export function scrollToAnchor(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function handleAnchorClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  const href = a?.getAttribute('href') ?? ''
  if (a && href.startsWith('#') && !href.startsWith('#/')) {
    e.preventDefault()
    scrollToAnchor(href.slice(1))
  }
}

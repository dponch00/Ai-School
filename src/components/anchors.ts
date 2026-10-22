import type { MouseEvent } from 'react'

/** Desplaza a un ancla interna: con hash routing, los enlaces #id no pueden navegar solos. */
export function scrollToAnchor(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

async function copyCode(button: HTMLElement) {
  const block = button.closest('.code-block')
  const pre = block?.querySelector('pre')
  const status = block?.querySelector('.code-block__status')
  if (!pre || !status) return
  try {
    await navigator.clipboard.writeText(pre.innerText)
    status.textContent = 'Copiado'
  } catch {
    status.textContent = 'No se pudo copiar; selecciona el texto'
  }
}

export function handleAnchorClick(e: MouseEvent) {
  const copy = (e.target as HTMLElement).closest('[data-copy]')
  if (copy) {
    void copyCode(copy as HTMLElement)
    return
  }
  const a = (e.target as HTMLElement).closest('a')
  const href = a?.getAttribute('href') ?? ''
  if (a && href.startsWith('#') && !href.startsWith('#/')) {
    e.preventDefault()
    scrollToAnchor(href.slice(1))
  }
}

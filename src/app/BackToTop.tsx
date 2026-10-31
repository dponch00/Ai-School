import { useEffect, useRef, useState } from 'react'

/**
 * Botón flotante para volver al inicio de la página en lecturas largas. Nunca tapa el texto:
 * - si a la derecha de la columna de lectura hay margen libre (escritorio, tableta en horizontal), se queda ahí;
 * - si no lo hay (celular), aparece solo al deslizar hacia arriba y se esconde al seguir leyendo o a los 2,5 s.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let lastY = window.scrollY
    let timer: number | undefined
    // Hay margen si entre el borde derecho del texto y el de la pantalla cabe el botón con aire a los lados.
    const hasGutter = () => {
      const column = document.querySelector('.reader__main') ?? document.querySelector('main .page')
      const button = ref.current
      if (!column || !button) return false
      return window.innerWidth - column.getBoundingClientRect().right >= button.offsetWidth + 32
    }
    const onScroll = () => {
      const y = window.scrollY
      const far = y > window.innerHeight * 1.5
      window.clearTimeout(timer)
      if (!far) setVisible(false)
      else if (hasGutter()) setVisible(true)
      else if (y < lastY - 4) {
        setVisible(true)
        timer = window.setTimeout(() => setVisible(false), 2500)
      } else if (y > lastY + 4) setVisible(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // El foco vuelve al contenido principal, para que el teclado y el lector de pantalla sigan desde arriba.
    document.getElementById('contenido')?.focus({ preventScroll: true })
    setVisible(false)
  }

  return (
    <button ref={ref} type="button" className={`back-to-top${visible ? ' back-to-top--visible' : ''}`} onClick={toTop} aria-label="Volver al inicio de la página" tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
      <span aria-hidden="true">↑</span>
      <span className="back-to-top__label">Arriba</span>
    </button>
  )
}

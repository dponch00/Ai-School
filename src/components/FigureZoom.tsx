import { useEffect, useRef } from 'react'

interface Props {
  figure: { src: string; alt: string; width: number; height: number } | null
  onClose: () => void
}

/** Un diagrama ampliado a pantalla completa: se acerca con dos dedos o girando el teléfono (T061-01). */
export default function FigureZoom({ figure, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (figure && !dialog.open) dialog.showModal()
    if (!figure && dialog.open) dialog.close()
  }, [figure])

  return (
    <dialog
      ref={ref}
      className="figure-zoom"
      aria-label="Diagrama ampliado"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {figure && (
        <>
          <button type="button" className="figure-zoom__close" onClick={onClose} aria-label="Cerrar el diagrama ampliado">✕</button>
          <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} />
        </>
      )}
    </dialog>
  )
}

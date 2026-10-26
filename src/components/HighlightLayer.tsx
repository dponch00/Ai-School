import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router'
import type { Highlight, HighlightColor } from '../domain/learner'
import { db } from '../storage/db'
import { addHighlight, deleteHighlight, lessonHighlights, MAX_HIGHLIGHT_NOTE, mergeHighlights, updateHighlight } from '../storage/highlights'
import { useLive } from '../storage/useLive'
import { drawHighlights, drawnRanges, HIGHLIGHT_COLORS, quoteAt, sectionOf, selectionQuote, textMap, type TextQuote } from './highlighting'

interface Props {
  /** Contenedor del cuerpo de la lección (los bloques `.prose`). */
  rootRef: RefObject<HTMLDivElement | null>
  courseId: string
  lessonId: string
  contentVersion: string
  /** El cuerpo ya está en el DOM. */
  ready: boolean
  /** Subrayado al que llevar la vista al abrir la lección (desde «Subrayados y notas»). */
  focusId?: string | null
}

type Anchor = TextQuote & { position: number; sectionId: string | null; sectionTitle: string | null }

/**
 * La selección pendiente de subrayar. Si se cruza con subrayados existentes, `overlap` dice cuáles
 * y cómo quedaría el tramo unido: no se crean marcas anidadas (T036-UX-04).
 */
type Pending = Anchor & { overlap: { ids: string[]; inside: boolean; merged: Anchor } | null }

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function flash(root: HTMLElement | null, id: string, scroll: 'smooth' | 'instant' | false) {
  const marks = root ? [...root.querySelectorAll<HTMLElement>(`mark[data-hl-id="${id}"]`)] : []
  if (marks.length === 0) return
  if (scroll) marks[0].scrollIntoView({ behavior: scroll === 'smooth' && !reduceMotion() ? 'smooth' : 'auto', block: 'center' })
  for (const m of marks) m.classList.add('hl--flash')
  window.setTimeout(() => marks.forEach((m) => m.classList.remove('hl--flash')), 2200)
}

/**
 * Subrayar y anotar dentro de una lección: barra al seleccionar texto, editor al tocar un subrayado
 * y la lista de subrayados de la lección (accesible con teclado).
 */
export default function HighlightLayer({ rootRef, courseId, lessonId, contentVersion, ready, focusId }: Props) {
  const list = useLive(() => lessonHighlights(db, lessonId), [lessonId], [] as Highlight[])
  const [missing, setMissing] = useState<string[]>([])
  const [pending, setPending] = useState<Pending | null>(null)
  const [editing, setEditing] = useState<{ id: string; focusNote: boolean } | null>(null)
  const focused = useRef<string | null>(null)
  const listRef = useRef(list)
  listRef.current = list

  // Dibuja los subrayados cada vez que cambian o que llega el cuerpo de la lección.
  const drawKey = list.map((h) => `${h.id}:${h.color}:${h.note ? 1 : 0}`).join('|')
  useEffect(() => {
    const root = rootRef.current
    if (!ready || !root) return
    setMissing(drawHighlights(root, list))
    if (focusId && focused.current !== focusId && list.some((h) => h.id === focusId)) {
      focused.current = focusId
      // Un pequeño margen: al recargar, el navegador restaura su posición de desplazamiento y pisaría el salto.
      window.setTimeout(() => flash(root, focusId, 'instant'), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, drawKey, focusId])

  // Barra de subrayado: aparece cuando hay una selección válida dentro del texto de la lección.
  useEffect(() => {
    let timer = 0
    const onChange = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const root = rootRef.current
        const sel = window.getSelection()
        if (!root || !sel || sel.isCollapsed || sel.rangeCount === 0) return setPending(null)
        const range = sel.getRangeAt(0)
        if (!root.contains(range.commonAncestorContainer)) return setPending(null)
        const q = selectionQuote(root, range)
        if (!q) return setPending(null)
        const section = sectionOf(root, range.startContainer)
        const anchor = { ...q, sectionId: section.id, sectionTitle: section.title }
        const map = textMap(root)
        const end = q.position + q.quote.length
        const hits = [...drawnRanges(map)].filter(([, r]) => r.start < end && q.position < r.end).sort((a, b) => a[1].start - b[1].start)
        if (hits.length === 0) return setPending({ ...anchor, overlap: null })
        const start = Math.min(q.position, hits[0][1].start)
        const stop = Math.max(end, ...hits.map(([, r]) => r.end))
        const first = hits[0][1].start <= q.position ? listRef.current.find((h) => h.id === hits[0][0]) : undefined
        const merged = { ...quoteAt(map.text, start, stop), position: start, sectionId: first ? first.sectionId : anchor.sectionId, sectionTitle: first ? first.sectionTitle : anchor.sectionTitle }
        const inside = hits.length === 1 && hits[0][1].start <= q.position && end <= hits[0][1].end
        setPending({ ...anchor, overlap: { ids: hits.map(([id]) => id), inside, merged } })
      }, 150)
    }
    document.addEventListener('selectionchange', onChange)
    return () => {
      document.removeEventListener('selectionchange', onChange)
      window.clearTimeout(timer)
    }
  }, [rootRef])

  // Tocar un subrayado abre su editor (si no se está seleccionando texto).
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // La marca o su botón ✎ de nota.
      const el = target.closest<HTMLElement>('[data-hl-id]')
      // Un enlace dentro del subrayado (una cita, por ejemplo) conserva su función.
      if (!el || target.closest('a')) return
      if (el.tagName === 'MARK' && !window.getSelection()?.isCollapsed) return
      setEditing({ id: el.dataset.hlId!, focusNote: el.tagName === 'BUTTON' })
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [rootRef, ready])

  const create = async (color: HighlightColor, withNote: boolean) => {
    if (!pending) return
    const { overlap: _, ...anchor } = pending
    const h = await addHighlight(db, { courseId, lessonId, contentVersion, color, ...anchor })
    window.getSelection()?.removeAllRanges()
    setPending(null)
    if (withNote) setEditing({ id: h.id, focusNote: true })
  }

  const merge = async () => {
    if (!pending?.overlap) return
    const [keep, ...rest] = pending.overlap.ids
    await mergeHighlights(db, keep, rest, { ...pending.overlap.merged, contentVersion })
    window.getSelection()?.removeAllRanges()
    setPending(null)
    window.setTimeout(() => flash(rootRef.current, keep, false), 50)
  }

  const editExisting = (id: string) => {
    window.getSelection()?.removeAllRanges()
    setPending(null)
    setEditing({ id, focusNote: false })
  }

  const current = editing ? list.find((h) => h.id === editing.id) : undefined

  return (
    <>
      <section className="section highlights" aria-labelledby="mis-subrayados">
        <h2 id="mis-subrayados">Mis subrayados en esta lección{list.length > 0 && ` (${list.length})`}</h2>
        {list.length === 0 ? (
          <p className="muted">Selecciona un texto de la lección para subrayarlo y, si quieres, agregarle una nota.</p>
        ) : (
          <ul className="hl-list">
            {list.map((h) => (
              <li key={h.id} className="hl-list__item">
                <p className="hl-list__quote"><mark className={`hl hl--${h.color}`}>{h.quote.length > 220 ? `${h.quote.slice(0, 220)}…` : h.quote}</mark></p>
                {h.note && <p className="hl-list__note">{h.note}</p>}
                {missing.includes(h.id) && (
                  <p className="hl-list__missing">
                    Este texto cambió en la lección y ya no se encuentra con seguridad; el subrayado y su nota se conservan. Si quieres, subraya el texto nuevo, copia ahí la nota y borra este.
                  </p>
                )}
                <p className="hl-list__actions">
                  {!missing.includes(h.id) && (
                    <button type="button" className="button button--small" onClick={() => flash(rootRef.current, h.id, 'smooth')}>Ver en el texto</button>
                  )}
                  <button type="button" className="button button--small" onClick={() => setEditing({ id: h.id, focusNote: true })}>{h.note ? 'Editar la nota' : 'Agregar una nota'}</button>
                  {missing.includes(h.id) && (
                    <button type="button" className="button button--small button--quiet" onClick={() => void deleteHighlight(db, h.id)}>Borrar subrayado</button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="muted"><Link to="/notas">Ver todos mis subrayados y notas</Link></p>
      </section>

      {pending?.overlap && !editing && (
        <div className="hl-bar" role="toolbar" aria-label="Subrayar la selección">
          {pending.overlap.inside ? (
            <>
              <span className="hl-bar__label">Este texto ya está subrayado.</span>
              <button type="button" className="button button--small" onPointerDown={(e) => e.preventDefault()} onClick={() => editExisting(pending.overlap!.ids[0])}>
                Editar el subrayado
              </button>
            </>
          ) : (
            <>
              <span className="hl-bar__label">{pending.overlap.ids.length > 1 ? 'Se cruza con subrayados tuyos.' : 'Se cruza con un subrayado tuyo.'}</span>
              <button type="button" className="button button--small" onPointerDown={(e) => e.preventDefault()} onClick={() => void merge()}>
                Unir al subrayado
              </button>
            </>
          )}
        </div>
      )}

      {pending && !pending.overlap && !editing && (
        <div className="hl-bar" role="toolbar" aria-label="Subrayar la selección">
          <span className="hl-bar__label">Subrayar</span>
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`hl-swatch hl-swatch--${c.id}`}
              aria-label={`Subrayar en ${c.label.toLowerCase()}`}
              // Evita que el toque borre la selección antes del clic.
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => void create(c.id, false)}
            />
          ))}
          <button type="button" className="button button--small" onPointerDown={(e) => e.preventDefault()} onClick={() => void create('amarillo', true)}>
            Subrayar y anotar
          </button>
        </div>
      )}

      {current && <Editor key={current.id} h={current} focusNote={editing!.focusNote} onClose={() => setEditing(null)} />}
    </>
  )
}

function Editor({ h, focusNote, onClose }: { h: Highlight; focusNote: boolean; onClose: () => void }) {
  const [note, setNote] = useState(h.note ?? '')
  const [status, setStatus] = useState<string | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    if (focusNote) noteRef.current?.focus()
    else panel.current?.querySelector<HTMLElement>('button')?.focus()
    // Si el foco venía del botón ✎, al redibujar las marcas ese botón se recreó: se busca el nuevo.
    return () => {
      if (previous?.isConnected) previous.focus()
      else document.querySelector<HTMLElement>(`button[data-hl-id="${h.id}"]`)?.focus()
    }
  }, [focusNote, h.id])

  const saveNote = async () => {
    if ((h.note ?? '') === note.trim()) return
    await updateHighlight(db, h.id, { note })
    setStatus(note.trim() ? 'Nota guardada.' : 'Nota quitada.')
  }

  return (
    <div
      ref={panel}
      className="hl-bar hl-editor"
      role="dialog"
      aria-label="Subrayado"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          void saveNote()
          onClose()
        }
      }}
    >
      <p className="hl-editor__quote"><mark className={`hl hl--${h.color}`}>{h.quote.length > 160 ? `${h.quote.slice(0, 160)}…` : h.quote}</mark></p>
      <div className="hl-editor__colors" role="group" aria-label="Color">
        {HIGHLIGHT_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`hl-swatch hl-swatch--${c.id}`}
            aria-label={c.label}
            aria-pressed={h.color === c.id}
            onClick={() => void updateHighlight(db, h.id, { color: c.id })}
          />
        ))}
      </div>
      <label className="hl-editor__note">
        Tu nota <small>(solo para ti; {note.length} de {MAX_HIGHLIGHT_NOTE.toLocaleString('es')})</small>
        <textarea ref={noteRef} rows={3} maxLength={MAX_HIGHLIGHT_NOTE} value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => void saveNote()} />
      </label>
      <p className="hl-editor__actions">
        <button type="button" className="button button--small" onClick={() => { void saveNote(); onClose() }}>Listo</button>
        <button
          type="button"
          className="button button--small button--quiet"
          onClick={async () => {
            await deleteHighlight(db, h.id)
            onClose()
          }}
        >
          Borrar subrayado
        </button>
        {status && <span role="status">{status}</span>}
      </p>
    </div>
  )
}

import type { TocEntry } from '../content'
import { handleAnchorClick } from './anchors'

interface Props {
  entries: TocEntry[]
  hasChecks?: boolean
  hasSources?: boolean
}

/** Índice: lateral y adhesivo en escritorio; desplegable al inicio en el celular (design-system §4). */
export default function Toc({ entries, hasChecks, hasSources }: Props) {
  const items = [
    ...entries,
    ...(hasChecks ? [{ id: 'comprobacion', text: 'Comprueba lo que aprendiste' }] : []),
    ...(hasSources ? [{ id: 'fuentes', text: 'Fuentes' }] : []),
  ]
  const list = (
    <ol className="toc__list" onClick={handleAnchorClick}>
      {items.map((e) => <li key={e.id}><a href={`#${e.id}`}>{e.text}</a></li>)}
    </ol>
  )
  return (
    <nav className="toc" aria-label="En esta sección">
      <details className="toc__mobile">
        <summary>En esta sección</summary>
        {list}
      </details>
      <div className="toc__desktop">
        <p className="toc__title">En esta sección</p>
        {list}
      </div>
    </nav>
  )
}

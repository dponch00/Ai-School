import { useState, type MouseEvent, type ReactNode } from 'react'
import type { Block, CoursePackage } from '../content'
import ProductCardView from './ProductCardView'
import { handleAnchorClick } from './anchors'
import RelationPanel, { relationFromClick, type Relation } from './RelationPanel'

interface Props {
  blocks: Block[]
  /** Fichas y activos del paquete del curso (F2-05). */
  productCards?: CoursePackage['productCards']
  assets?: CoursePackage['assets']
  /** Se inserta donde el Markdown marca ::check-questions. */
  checks?: ReactNode
  /** Preguntas del laboratorio para un paso (::lab-questions{step=…}, D-024). */
  labQuestions?: (step: string) => ReactNode
  sources: { id: string; title: string; url: string }[]
}

const today = new Date().toISOString().slice(0, 10)

export default function LessonBlocks({ blocks, checks, labQuestions, sources, productCards = {}, assets = {} }: Props) {
  const sourceById = new Map(sources.map((s) => [s.id, s]))
  const [relations, setRelations] = useState<Relation[]>([])
  // Términos, referencias y citas se abren en el panel lateral; el resto de los enlaces internos, como antes.
  const onClick = (e: MouseEvent) => {
    const relation = relationFromClick(e)
    if (!relation) return handleAnchorClick(e)
    e.preventDefault()
    setRelations([relation])
  }
  return (
    <div className="lesson-body" onClick={onClick}>
      <RelationPanel stack={relations} onChange={setRelations} />
      {blocks.map((b, i) => {
        if (b.type === 'html') return <div key={i} className="prose" dangerouslySetInnerHTML={{ __html: b.html }} />
        if (b.type === 'check-questions') return <div key={i}>{checks}</div>
        if (b.type === 'lab-questions') return <div key={i}>{labQuestions?.(b.id)}</div>
        if (b.type === 'product-card') {
          const card = productCards[b.id]
          if (!card) return null
          const cardSources = card.sourceIds.map((id) => sourceById.get(id) ?? { id, title: id, url: '#' })
          return <ProductCardView key={i} card={card} sources={cardSources} today={today} />
        }
        const asset = assets[b.id]
        if (!asset) return null
        return (
          <figure key={i} className="lesson-figure">
            <img src={`${import.meta.env.BASE_URL}${asset.url}`} alt={asset.alt} width={asset.dimensions.width} height={asset.dimensions.height} loading="lazy" />
          </figure>
        )
      })}
    </div>
  )
}

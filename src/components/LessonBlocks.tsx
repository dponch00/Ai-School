import type { ReactNode } from 'react'
import { content, type Block } from '../content'
import ProductCardView from './ProductCardView'
import { handleAnchorClick } from './anchors'

interface Props {
  blocks: Block[]
  /** Se inserta donde el Markdown marca ::check-questions. */
  checks?: ReactNode
  sources: { id: string; title: string; url: string }[]
}

const today = new Date().toISOString().slice(0, 10)

export default function LessonBlocks({ blocks, checks, sources }: Props) {
  const sourceById = new Map(sources.map((s) => [s.id, s]))
  return (
    <div className="lesson-body" onClick={handleAnchorClick}>
      {blocks.map((b, i) => {
        if (b.type === 'html') return <div key={i} className="prose" dangerouslySetInnerHTML={{ __html: b.html }} />
        if (b.type === 'check-questions') return <div key={i}>{checks}</div>
        if (b.type === 'product-card') {
          const card = content.productCards[b.id]
          if (!card) return null
          const cardSources = card.sourceIds.map((id) => sourceById.get(id) ?? { id, title: id, url: '#' })
          return <ProductCardView key={i} card={card} sources={cardSources} today={today} />
        }
        const asset = content.assets[b.id]
        if (!asset) return null
        return (
          <figure key={i} className="lesson-figure">
            <img src={`/${asset.url}`} alt={asset.alt} width={asset.dimensions.width} height={asset.dimensions.height} loading="lazy" />
          </figure>
        )
      })}
    </div>
  )
}

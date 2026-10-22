import type { ProductCard, Source } from '../domain/content'
import { isProductCardStale } from '../domain/content'

const SURFACE: Record<string, string> = {
  chat: 'chat', api: 'API', cli: 'CLI', ide: 'IDE', desktop: 'app de escritorio', web: 'web', cloud: 'nube', mobile: 'móvil',
}
const MATURITY: Record<string, string> = { ga: 'disponible (GA)', beta: 'beta', preview: 'vista previa', deprecated: 'en retiro' }

interface Props {
  card: ProductCard
  sources: Pick<Source, 'id' | 'title' | 'url'>[]
  today: string
}

/** Ficha de producto (D-007, D-019): lo que depende de un producto, fechado y con fuente. */
export default function ProductCardView({ card, sources, today }: Props) {
  const stale = isProductCardStale(card, today)
  return (
    <aside className={stale ? 'product-card product-card--stale' : 'product-card'} aria-label={`Ficha de producto: ${card.product}`}>
      <header className="product-card__header">
        <span className="product-card__kind">
          {stale ? '⏱ Pendiente de verificar' : card.kind === 'guidance' ? 'Ficha de producto · recomendación del proveedor' : `Ficha de producto · ${MATURITY[card.maturity!]}`}
        </span>
        <span className="product-card__product">{card.product}</span>
      </header>
      <p className="product-card__text">{card.capability}</p>
      <dl className="product-card__meta">
        <div><dt>Superficie</dt><dd>{card.surfaces.map((s) => SURFACE[s] ?? s).join(', ')}</dd></div>
        <div><dt>Verificado</dt><dd>{card.verifiedAt}</dd></div>
        <div><dt>Próxima revisión</dt><dd>{card.nextReview}</dd></div>
        <div>
          <dt>Fuente</dt>
          <dd>
            {sources.map((s, i) => (
              <span key={s.id}>{i > 0 && ' · '}<a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></span>
            ))}
          </dd>
        </div>
      </dl>
    </aside>
  )
}

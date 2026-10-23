import { useEffect, useId, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { loadSearchDocs, type SearchDoc } from '../content'
import { createIndex, search } from '../search'

const KIND = { section: 'Lección', lab: 'Laboratorio', glossary: 'Glosario' } as const

/** Búsqueda sin conexión en lecciones, laboratorio y glosario (F2-07). */
export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const inputId = useId()
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  useEffect(() => {
    void loadSearchDocs().then(setDocs)
  }, [])
  const index = useMemo(() => (docs ? createIndex(docs) : null), [docs])
  const hits = useMemo(() => (index ? search(index, q) : []), [index, q])

  return (
    <div className="page page--reader">
      <article className="form-page">
        <h1>Buscar</h1>
        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={inputId}>Buscar en las lecciones, el laboratorio y el glosario</label>
          <input
            id={inputId}
            type="search"
            value={q}
            autoFocus
            placeholder="Por ejemplo: invariante, supuestos, criterio de aceptación"
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          />
        </form>
        {!index && <p className="muted" role="status">Preparando la búsqueda…</p>}
        {index && q.trim().length >= 2 && (
          <p className="muted" role="status">{hits.length === 0 ? 'Sin resultados. Prueba con otra palabra o revisa el glosario.' : `${hits.length} ${hits.length === 1 ? 'resultado' : 'resultados'}`}</p>
        )}
        <ol className="search-results">
          {hits.map((h) => (
            <li key={h.id}>
              <Link to={h.href} className="search-result">
                <span className="search-result__kind">{KIND[h.kind]} · {h.context}</span>
                <span className="search-result__title">{h.title}</span>
                <span className="search-result__snippet">{h.snippet}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p><Link to="/glosario">Ver el glosario completo</Link> · <Link to="/notas">Mis notas y marcadores</Link></p>
      </article>
    </div>
  )
}

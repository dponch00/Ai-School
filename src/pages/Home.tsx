import { Link } from 'react-router'
import { content, imageSrcSet } from '../content'

export default function Home() {
  const m02 = content.courses.find((c) => c.id === 'm02')
  return (
    <div className="page">
      <section className="hero">
        <img
          className="hero__image"
          src="/images/hero-960.webp"
          srcSet={imageSrcSet('hero')}
          sizes="(min-width: 76rem) 76rem, 100vw"
          alt=""
          width={1600}
          height={900}
        />
        <div className="hero__text">
          <h1>Dirige agentes de IA con criterio</h1>
          <p className="lead">
            Diez manuales para pasar de pedirle cosas a la IA a especificar, verificar y mantener herramientas que funcionan.
          </p>
          {m02 && (
            <Link className="button button--primary" to={`/cursos/m02/lecciones/${m02.lessons[0]?.id}`}>
              Empezar con M02: {m02.title}
            </Link>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="ruta">
        <h2 id="ruta">Tu ruta</h2>
        <p className="muted">
          El piloto empieza por M02 porque fija cómo se escriben y verifican todas las tareas que le darás a un agente. Los
          demás manuales llegarán después.
        </p>
        <p>
          <Link to="/diagnostico">Haz el diagnóstico inicial</Link> (unos 25 minutos) para saber por dónde te conviene empezar y
          en qué bloques puedes ir más rápido. Si es tu primera vez, lee <Link to="/como-funciona">cómo funciona</Link>: en qué
          orden estudiar y qué cuenta para terminar un curso. Todo se responde con opción múltiple.
        </p>
        <ol className="route">
          {content.catalog.map((c) => {
            const draft = !c.available && content.courses.some((x) => x.id === c.id)
            return (
              <li key={c.id} className={c.available ? 'route__item route__item--available' : 'route__item'}>
                <span className="route__code">{c.id.toUpperCase()}</span>
                {c.available || draft ? <Link to={`/cursos/${c.id}`}>{c.title}</Link> : <span>{c.title}</span>}
                <span className="route__status">{c.available ? 'Disponible' : draft ? 'En preparación' : 'Próximamente'}</span>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

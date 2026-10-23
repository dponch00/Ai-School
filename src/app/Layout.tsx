import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import StorageNotice from './StorageNotice'
import UpdatePrompt from './UpdatePrompt'

export default function Layout() {
  const { pathname } = useLocation()

  // Al cambiar de página, el lector empieza arriba y el foco va al contenido principal.
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('contenido')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#contenido" onClick={(e) => { e.preventDefault(); document.getElementById('contenido')?.focus() }}>
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand">AI School</Link>
          <Link to="/buscar" className="header-search"><span aria-hidden="true">⌕</span> Buscar</Link>
          <nav aria-label="Principal">
            <NavLink to="/cursos">Cursos</NavLink>
            <NavLink to="/diagnostico">Diagnóstico</NavLink>
            <NavLink to="/notas">Notas</NavLink>
            <NavLink to="/respaldo">Respaldo</NavLink>
          </nav>
        </div>
      </header>
      <StorageNotice />
      <UpdatePrompt />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Datos sintéticos de una empresa ficticia. Versión piloto en construcción. Tu progreso se guarda solo en este navegador.</p>
        <p className="site-footer__links"><Link to="/como-funciona">Cómo funciona</Link> · <Link to="/glosario">Glosario</Link></p>
      </footer>
    </>
  )
}

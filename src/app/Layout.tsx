import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'

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
          <nav aria-label="Principal">
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/cursos">Cursos</NavLink>
          </nav>
        </div>
      </header>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Datos sintéticos de una empresa ficticia. Versión piloto en construcción: aún no guarda tu progreso.</p>
      </footer>
    </>
  )
}

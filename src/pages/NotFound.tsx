import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="page">
      <div className="notice notice--warning" role="status">
        <p className="notice__title">No encontramos esta página</p>
        <p>Puede que el curso o la lección todavía no estén publicados.</p>
        <p><Link to="/cursos">Volver a los cursos</Link></p>
      </div>
    </div>
  )
}

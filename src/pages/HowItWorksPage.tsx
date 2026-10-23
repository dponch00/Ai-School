import { Link } from 'react-router'
import { DEFAULT_PASS_RULE } from '../domain/scoring'
import { ITEMS_PER_OBJECTIVE, RETENTION_DAYS, RETENTION_RULE } from '../storage/exam'

// El examen y la retención usan un ítem por objetivo y por ranura; M02 tiene 6 objetivos evaluados.
const OBJECTIVES = 6
const EXAM_ITEMS = OBJECTIVES * ITEMS_PER_OBJECTIVE

/** Guía de uso: en qué orden estudiar y qué cuenta para terminar un curso (D-024: todo es opción múltiple). */
export default function HowItWorksPage() {
  return (
    <div className="page page--reader">
      <article className="how">
        <h1>Cómo funciona</h1>
        <p className="lead">
          En qué orden estudiar un curso y qué cuenta para terminarlo. Todo se responde con opción múltiple y cada respuesta
          trae la explicación de por qué es o no la mejor: no hay nada que redactar ni que entregar.
        </p>

        <h2 id="ruta">La ruta de un curso, en orden</h2>
        <ol className="how__steps">
          <li>
            <h3>Haz el diagnóstico inicial <span className="how__tag">opcional</span></h3>
            <p className="how__where"><Link to="/diagnostico">Diagnóstico</Link> · unos 25 minutos</p>
            <p>Te da una señal por bloque para saber por dónde empezar. No es una nota: con cuatro preguntas por bloque es una pista.</p>
          </li>
          <li>
            <h3>Lee las lecciones <span className="how__tag how__tag--counts">cuenta</span></h3>
            <p className="how__where">Portada del curso · Lecciones</p>
            <p>Cada una abre con un repaso de la anterior y cierra con una comprobación. Una lección cuenta como completada cuando respondes todas sus preguntas. Puedes dejar notas y marcadores, que solo ves tú.</p>
          </li>
          <li>
            <h3>Resuelve el laboratorio <span className="how__tag how__tag--counts">cuenta</span></h3>
            <p className="how__where">Portada del curso · Laboratorio</p>
            <p>Es un caso completo de la empresa ficticia del curso, por pasos. Al final de cada paso tomas las decisiones clave respondiendo preguntas. Cuenta como hecho cuando las respondes todas. Si quieres practicar con un agente de verdad, el caso trae los datos y un script para hacerlo en tu entorno, sin registrar nada.</p>
          </li>
          <li>
            <h3>Practica y repasa tus errores <span className="how__tag">práctica</span></h3>
            <p className="how__where">Portada del curso · Práctica y examen</p>
            <p>Las preguntas de práctica no cuentan para aprobar. Si al responder marcas «Estoy muy seguro» y fallas, esa pregunta vuelve al día siguiente; si la aciertas, vuelve siete días después, y con esos dos aciertos seguidos sale del repaso. Si la vuelves a fallar, regresa al día siguiente.</p>
          </li>
          <li>
            <h3>Presenta el examen <span className="how__tag how__tag--counts">cuenta</span></h3>
            <p className="how__where">Portada del curso · Examen · se puede pausar y retomar</p>
            <p>
              Son {EXAM_ITEMS} preguntas y apruebas con {DEFAULT_PASS_RULE.minCorrect}, siempre que no falles todas las de un mismo
              objetivo. Si no apruebas, el reintento se abre al día siguiente, después de repasar las lecciones donde fallaste, y trae
              preguntas nuevas. Si apruebas, a los {RETENTION_DAYS} días hay una comprobación de retención de {OBJECTIVES} preguntas
              que pide {RETENTION_RULE.minCorrect}.
            </p>
          </li>
        </ol>
        <div className="notice notice--info">
          <p className="notice__title">Para terminar un curso</p>
          <p>Completa sus lecciones, resuelve el laboratorio y aprueba el examen. La comprobación de retención confirma que lo aprendido sigue ahí, pero no bloquea nada.</p>
        </div>

        <h2 id="cuidado">Antes de empezar</h2>
        <ul>
          <li><strong>Tu progreso vive solo en este navegador.</strong> No hay cuentas: otro navegador o dispositivo empieza vacío.</li>
          <li><strong>Haz un respaldo de vez en cuando</strong> en <Link to="/respaldo">Respaldo</Link>. Ahí también puedes pedir que el navegador no borre tus datos.</li>
          <li><strong>Sin conexión:</strong> en la portada de cada curso, «Descargar para usar sin conexión».</li>
          <li><strong>Solo datos ficticios.</strong> Los casos usan una empresa inventada.</li>
        </ul>
      </article>
    </div>
  )
}

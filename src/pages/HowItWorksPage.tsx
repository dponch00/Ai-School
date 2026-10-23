import { Link } from 'react-router'
import { DEFAULT_PASS_RULE } from '../domain/scoring'
import { ITEMS_PER_OBJECTIVE, RETENTION_DAYS, RETENTION_RULE } from '../storage/exam'

// El examen y la retención usan un ítem por objetivo y por ranura; M02 tiene 6 objetivos evaluados.
const OBJECTIVES = 6
const EXAM_ITEMS = OBJECTIVES * ITEMS_PER_OBJECTIVE

/** Guía de uso: en qué orden estudiar y quién califica qué. Nació de una duda real del piloto. */
export default function HowItWorksPage() {
  return (
    <div className="page page--reader">
      <article className="how">
        <h1>Cómo funciona</h1>
        <p className="lead">
          En qué orden estudiar un curso, qué cuenta para aprobar y cómo se evalúan las respuestas que escribes con tus
          palabras.
        </p>

        <h2 id="ruta">La ruta de un curso, en orden</h2>
        <ol className="how__steps">
          <li>
            <h3>Llena tu perfil</h3>
            <p className="how__where">Perfil · opcional, pero el evaluador lo usa para entender quién eres</p>
            <p>Usa datos generales: el reporte lo vas a pegar en un chat externo. Tu autoevaluación por competencia aparece como tu percepción, separada de lo que la app observó.</p>
          </li>
          <li>
            <h3>Haz el diagnóstico inicial <span className="how__tag">práctica</span></h3>
            <p className="how__where"><Link to="/diagnostico">Diagnóstico</Link> · unos 25 minutos</p>
            <p>Te da señales por bloque para saber por dónde empezar. No es una nota: con cuatro preguntas por bloque es una pista.</p>
          </li>
          <li>
            <h3>Lee las lecciones <span className="how__tag">práctica</span></h3>
            <p className="how__where">Portada del curso · Lecciones</p>
            <p>Cada una abre con un repaso de la anterior y cierra con una comprobación que explica cada opción. Si fallas con seguridad alta, la pregunta vuelve en el repaso de errores. Tus notas y marcadores son privados.</p>
          </li>
          <li>
            <h3>Practica y repasa tus errores <span className="how__tag">práctica</span></h3>
            <p className="how__where">Portada del curso · Práctica y examen</p>
            <p>Las preguntas de práctica no cuentan para aprobar. Lo que fallaste estando seguro vuelve al día siguiente; si lo aciertas, vuelve siete días después, y con esos dos aciertos seguidos sale del repaso. Si lo vuelves a fallar, regresa al día siguiente.</p>
          </li>
          <li>
            <h3>Haz el laboratorio <span className="how__tag how__tag--counts">cuenta</span></h3>
            <p className="how__where">Portada del curso · Laboratorio · se trabaja en tu propio entorno</p>
            <p>Guardas tu entrega con sus evidencias, el cuaderno de decisiones y tu autoevaluación con la rúbrica. En cada criterio citas primero la parte de tu entrega que lo demuestra y después eliges el nivel.</p>
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
          <li>
            <h3>Pide la evaluación y regístrala <span className="how__tag">profundiza</span></h3>
            <p className="how__where"><Link to="/evaluacion">Evaluación</Link> y <Link to="/ruta">Mi ruta</Link></p>
            <p>No hace falta para completar el curso: sirve para que alguien revise tu entrega y para ajustar tu ruta. Se explica en la sección siguiente.</p>
          </li>
        </ol>
        <div className="notice notice--info">
          <p className="notice__title">Qué hace falta para cada cosa</p>
          <p><strong>Para completar un curso:</strong> leer las lecciones, entregar el laboratorio con tu autoevaluación y aprobar el examen.</p>
          <p><strong>Para que tu entrega quede como «Revisada»:</strong> además, dos revisiones externas de corridas distintas que no difieran en más de un nivel en ningún criterio.</p>
        </div>

        <h2 id="texto">¿Quién califica las respuestas de texto?</h2>
        <p>
          <strong>La app no las califica.</strong> Solo corrige la opción múltiple: comprobaciones, práctica, diagnóstico y examen.
          La entrega del laboratorio, el cuaderno y las microtareas del diagnóstico los evalúa un chat de IA que tú eliges, a partir
          del reporte que la app prepara. La app no lleva IA ni claves de API: no cuesta nada, tus datos no salen del navegador
          hasta que tú pegas el reporte y funciona sin conexión.
        </p>
        <ol className="how__flow">
          <li><strong>Autoevalúate</strong> con la rúbrica del laboratorio, citando tu entrega en cada criterio.</li>
          <li><strong>Prepara el reporte</strong> en <Link to="/evaluacion">Evaluación</Link>: elige el alcance y revisa la vista previa.</li>
          <li><strong>Llévalo a un chat:</strong> «Descargar HTML para el chat» o «Copiar contexto en Markdown», y después «Copiar instrucción». Pégalos en un chat nuevo.</li>
          <li><strong>Registra la revisión</strong> en el laboratorio, en «Revisiones externas»: el nivel por criterio y la cita que dio el evaluador. Sin cita no se acepta.</li>
          <li><strong>Registra la retroalimentación general</strong> en <Link to="/ruta">Mi ruta</Link>. La app la convierte en propuestas que tú aceptas, pospones o descartas.</li>
        </ol>
        <div className="notice notice--info">
          <p className="notice__title">Dos miradas valen más que una</p>
          <p>Pide la revisión del laboratorio en dos chats distintos. La app compara las dos más recientes y avisa si difieren en más de un nivel; en ese caso conviene una tercera.</p>
        </div>

        <h2 id="cuidado">Antes de empezar</h2>
        <ul>
          <li><strong>Tu progreso vive solo en este navegador.</strong> No hay cuentas: otro navegador o dispositivo empieza vacío.</li>
          <li><strong>Haz un respaldo de vez en cuando</strong> en <Link to="/perfil">Perfil</Link> › Respaldo. Ahí también puedes pedir que el navegador no borre tus datos.</li>
          <li><strong>Sin conexión:</strong> en la portada de cada curso, «Descargar para usar sin conexión».</li>
          <li><strong>Solo datos ficticios.</strong> Los casos usan una empresa inventada; no pongas datos reales de tu trabajo en el perfil ni en las entregas.</li>
        </ul>
      </article>
    </div>
  )
}

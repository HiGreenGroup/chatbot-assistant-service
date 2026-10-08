# Base de conocimiento — Empresas (EmpleoServicio)

Esta carpeta documenta **todo lo que una empresa puede hacer en la plataforma**
EmpleoServicio: registro, planes, publicación de vacantes, gestión de
candidatos y evaluación con IA. Está escrita para alimentar a un asistente/
chatbot que responde preguntas de empresas usuarias, así que cada archivo
describe el flujo real tal como está implementado en el código (no son
aspiraciones ni roadmap, salvo que se indique explícitamente).

Es la **primera parte** de una base de conocimiento que cubrirá toda la app
(candidatos, admin, etc. vendrán después).

## Índice

1. [Registro y onboarding](./01-registro-y-onboarding.md) — cómo se crea una
   cuenta de empresa, verificación por OTP, selección de plan obligatoria.
2. [Planes y precios](./02-planes-y-precios.md) — qué incluye cada plan, cómo
   se paga, cómo se actualiza/cancela una suscripción.
3. [Publicar una vacante](./03-publicar-vacante.md) — formulario de
   publicación, generación con IA, rúbrica de entrevista, límites por plan.
4. [Gestionar vacantes](./04-gestionar-vacantes.md) — pausar, activar, editar,
   duplicar, compartir y cerrar una oferta.
5. [Gestionar candidatos](./05-gestionar-candidatos.md) — todo el pipeline:
   preseleccionar, descartar, agendar entrevistas, evaluar, seleccionar,
   notas, puntaje de compatibilidad (match score).
6. [Tests IA](./06-tests-ia.md) — banco de pruebas, asignación a candidatos,
   comparación de resultados con IA.
7. [Preguntas frecuentes](./07-preguntas-frecuentes.md) — formato pregunta/
   respuesta corto, pensado para que el asistente cite directamente.

## Qué NO existe todavía (no lo ofrezcas como disponible)

- **Gestión de empleados / multi-usuario por empresa**: la página
  `/company/employees` es un placeholder sin funcionalidad real. Una empresa
  no puede invitar a varios usuarios de su equipo a la plataforma hoy.
- No hay verificación automática de pagos por transferencia bancaria: una
  empresa que paga por transferencia sube un comprobante y queda pendiente de
  confirmación manual (no es instantáneo como con tarjeta).

## Convenciones usadas en estos documentos

- Los nombres de archivo/componente entre paréntesis son referencias internas
  para quien mantenga esta base de conocimiento (ingeniería), no se los debes
  repetir al usuario final.
- Cuando un dato viene inferido del código y no está confirmado por producto/
  backend (p. ej. el nombre exacto de un estado interno), se marca con
  "⚠️ verificar" en el documento fuente — el asistente no debe presentar esos
  puntos como un hecho 100% confirmado si el usuario pregunta por el detalle
  exacto.

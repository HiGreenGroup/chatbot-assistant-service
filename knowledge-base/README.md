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
8. [Panel y navegación](./08-panel-y-navegacion.md) — menú del panel,
   Dashboard, dónde está cada función.
9. [Match score](./09-match-score.md) — cómo se calcula el puntaje de
   compatibilidad, pesos, clasificación, elegibilidad, confianza, anti-sesgo.
10. [Entrevistas y calendario](./10-entrevistas-y-calendario.md) — agendar,
    reprogramar, calendario semanal, videollamadas, calificación.
11. [Emails y notificaciones](./11-emails-y-notificaciones.md) — qué emails
    automáticos existen y cuáles no.
12. [Reportes y exportación](./12-reportes-y-exportacion.md) — estadísticas
    disponibles y qué se puede descargar.
13. [Equipo y permisos](./13-equipo-y-permisos.md) — multiusuario (no
    disponible) y alternativas.
14. [Integraciones](./14-integraciones.md) — integraciones y marca blanca (no
    disponibles) y lo que sí conecta.
15. [Seguridad y privacidad](./15-seguridad-y-privacidad.md) — medidas de
    seguridad, Ley 172-13, retención y derechos.
16. [Contratación masiva y ferias](./16-contratacion-masiva-y-ferias.md) —
    cómo aprovechar la plataforma con alto volumen.
17. [Soporte y ayuda](./17-soporte-y-ayuda.md) — canales de contacto reales,
    centro de ayuda, OTP y contraseña.

## Origen de los documentos 08–17

Los documentos 08–17 (y las secciones añadidas a 01–07) se armaron a partir
de la guía "FAQ Empresas EmpleoServicio COMPLETO" (oct. 2026), **verificando
cada afirmación contra el código** (`fe-empleo-servicio`,
`se-core-management-empleo-servicio`, `se-ia-management-empleo-servicio`).
Esa guía describe muchas funciones que hoy no existen; en vez de copiarlas,
se documentan explícitamente como "no disponible" para que el asistente no
las prometa. Si producto lanza alguna de ellas, hay que actualizar el
documento correspondiente.

## Qué NO existe todavía (no lo ofrezcas como disponible)

- **Gestión de empleados / multi-usuario por empresa**: la página
  `/company/employees` es un placeholder sin funcionalidad real. Una empresa
  no puede invitar a varios usuarios de su equipo a la plataforma hoy. No hay
  roles (Admin/Recruiter/Viewer).
- No hay verificación automática de pagos por transferencia bancaria: una
  empresa que paga por transferencia sube un comprobante y queda pendiente de
  confirmación manual (no es instantáneo como con tarjeta).
- Integraciones (Google Calendar, Outlook, Zoom, Meet, Teams, HRIS, CRM,
  Drive, webhooks/API) y marca blanca.
- Shortlists/favoritos, pool global de candidatos, búsquedas guardadas,
  importar candidatos por CSV, acciones masivas, exportar candidatos a Excel.
- Módulo de reportes con filtros/ROI; personalización del Dashboard.
- Emails a la empresa por nuevas postulaciones, alertas/SMS, plantillas de
  email editables, mensajería libre con candidatos, recordatorio de
  entrevista 24h, auto-agendamiento del candidato.
- Estados "Archivada" y "reabrir vacante cerrada".
- 2FA; certificaciones ISO 27001/SOC 2; cumplimiento GDPR/CCPA declarado.
- Prueba gratis de 14 días; cobros por test o por usuario extra; límites de
  tests por mes o de candidatos por plan.
- Canales de soporte support@/legal@/product@, teléfono, chat en vivo
  humano, webinars, certificación, roadmap público.

## Convenciones usadas en estos documentos

- Los nombres de archivo/componente entre paréntesis son referencias internas
  para quien mantenga esta base de conocimiento (ingeniería), no se los debes
  repetir al usuario final.
- Cuando un dato viene inferido del código y no está confirmado por producto/
  backend (p. ej. el nombre exacto de un estado interno), se marca con
  "⚠️ verificar" en el documento fuente — el asistente no debe presentar esos
  puntos como un hecho 100% confirmado si el usuario pregunta por el detalle
  exacto.

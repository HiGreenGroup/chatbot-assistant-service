# Panel de empresa y navegación

Esta guía explica cómo está organizado el panel de una empresa en
EmpleoServicio y dónde encontrar cada función.

## Menú principal del panel de empresa

En la barra superior del panel la empresa tiene estas secciones:

- **Dashboard** (`/company`): resumen de actividad de la empresa.
- **Ofertas de Trabajo** (`/company/jobs`): listado de todas sus vacantes
  (activas, pausadas y cerradas), con buscador y acciones por vacante.
- **Publicar Empleo** (`/company/publish`): formulario para crear una vacante
  nueva, a mano o con IA.
- **Entrevistas** (`/interviews`): calendario semanal con todas las
  entrevistas agendadas de la empresa (ver
  [Entrevistas y calendario](./10-entrevistas-y-calendario.md)).
- **Evaluaciones** (`/company/tests`): sección de Tests IA (asignar,
  biblioteca, comparar candidatos, historial de envíos). Solo para planes de
  pago (ver [Tests IA](./06-tests-ia.md)).

En el menú de la cuenta (ícono de usuario, arriba a la derecha) está el
acceso a **Ver perfil** (`/company/profile`), donde se editan los datos de la
empresa, el logo y las redes sociales. Los planes y la suscripción se
gestionan en `/company/plans`.

## Qué muestra el Dashboard (pantalla de inicio)

El Dashboard (`/company`) muestra un resumen rápido:

- Un aviso para **completar el perfil** de la empresa si está incompleto, o
  una invitación a **mejorar el plan** si la empresa está en el plan Gratis.
- Un resumen del perfil y del **plan actual**.
- Indicadores rápidos: **empleos activos**, **candidatos** y
  **contrataciones**.
- Las **vacantes publicadas más recientes**.
- Un **centro de ayuda** con accesos rápidos, preguntas frecuentes y el chat
  del asistente virtual.

El Dashboard **no es personalizable** hoy: no se pueden elegir qué métricas
mostrar, cambiar rangos de fechas ni exportar el resumen a PDF.

## Dónde ver las métricas de cada vacante

Las estadísticas detalladas están **por vacante**, en la pantalla de gestión
de esa vacante (`/company/jobs/{id}/manage`) y en su detalle:

- **Visitas**: cuántas veces se vio la oferta.
- **Aplicaciones**: cuántos candidatos se postularon.
- **Entrevistas**: cuántas entrevistas se han hecho/agendado.
- **Contrataciones**: cuántos candidatos fueron seleccionados.

No existe una sección separada de "Reportes y estadísticas" con filtros por
período, sector o comparativas; ver
[Reportes y exportación de datos](./12-reportes-y-exportacion.md).

## Dónde está cada cosa (guía rápida)

| Quiero... | Dónde |
|---|---|
| Publicar una vacante | Publicar Empleo (`/company/publish`) |
| Ver, pausar, editar, duplicar o compartir mis vacantes | Ofertas de Trabajo (`/company/jobs`) |
| Ver los candidatos de una vacante y moverlos en el proceso | Ofertas de Trabajo → la vacante → Gestionar (`/company/jobs/{id}/manage`) |
| Cerrar una vacante definitivamente | Dentro de la gestión de esa vacante |
| Ver el perfil completo de un candidato | Desde la gestión de la vacante, abriendo al candidato (`/company/candidates/{id}`) |
| Ver todas mis entrevistas | Entrevistas (`/interviews`) |
| Asignar o crear tests, comparar candidatos | Evaluaciones (`/company/tests`) |
| Cambiar de plan o cancelar suscripción | `/company/plans` |
| Pagar un plan | `/company/check-out` |
| Editar datos de la empresa, logo, redes sociales | Ver perfil (`/company/profile`) |

## Notificaciones dentro del panel

Hoy el panel **no tiene un centro de notificaciones** (campana) dentro de la
aplicación. Las comunicaciones importantes llegan por email; ver
[Emails y notificaciones](./11-emails-y-notificaciones.md).

# Gestionar vacantes publicadas

Página de listado: `/company/jobs`. Página de gestión individual:
`/company/jobs/{id}/manage`.

## Estados de una vacante

Una vacante puede estar: **Activa**, **Pausada** o **Cerrada**.

- **Pausar** una vacante la oculta temporalmente de los candidatos, sin
  cerrarla ni perder a los candidatos que ya aplicaron. Se puede reactivar
  cuando se quiera.
- **Activar** una vacante pausada vuelve a mostrarla a los candidatos. Esto
  también respeta el límite de vacantes activas del plan: si la empresa ya
  está al límite, no puede activar una más sin liberar espacio o subir de
  plan.
- **Cerrar vacante** finaliza el proceso de forma permanente. A diferencia
  de pausar, cerrar **no se puede deshacer**, y al cerrar se **notifica por
  email automáticamente a los candidatos que no fueron seleccionados**, para
  que sepan que el proceso terminó. El botón de cerrar vacante vive dentro de
  la pantalla de gestión de esa vacante en particular (no en el listado
  general).

## Acciones disponibles por vacante

Desde el listado (`/company/jobs`) y desde la pantalla de gestión individual,
la empresa puede:

- **Editar** la vacante (mismo formulario que al publicar, con los datos
  pre-cargados).
- **Pausar / Activar**.
- **Cerrar vacante** (solo desde la gestión individual — ver arriba).
- **Duplicar**: crea una vacante nueva con los mismos datos, para no tener
  que llenar todo de nuevo.
- **Publicar en redes sociales / Compartir**: abre un diálogo con botones
  para LinkedIn, Facebook, Instagram, WhatsApp, o simplemente copiar el link
  de la vacante.
  - Si la empresa tiene guardado en su perfil el link de su página/perfil de
    LinkedIn, Facebook o Instagram, al presionar ese botón la plataforma
    **copia automáticamente el link de la vacante al portapapeles** y
    muestra un paso a paso de cómo pegarlo y publicarlo en esa red (por
    ejemplo, en LinkedIn: "Haz clic en Crear → Compartir una publicación →
    pega el link → Publicar"), y luego abre esa red social en una pestaña
    nueva para que la empresa termine de publicar.
  - Si la empresa no tiene esa red social configurada en su perfil, el botón
    simplemente copia el link (o abre el diálogo de publicación genérico de
    esa red, en el caso de Facebook/LinkedIn) para que lo pegue donde
    quiera.
- **Rúbrica**: editar la rúbrica de evaluación de entrevista de esa vacante
  en cualquier momento (ver [Publicar una vacante](./03-publicar-vacante.md)
  para las reglas de la rúbrica).

## Panel de gestión individual (`/company/jobs/{id}/manage`)

Además de las acciones anteriores, esta pantalla muestra:

- Estadísticas de la vacante: visitas, aplicaciones, entrevistas realizadas,
  contrataciones.
- El listado completo de candidatos que aplicaron a esa vacante, con todas
  las acciones de gestión del pipeline (ver
  [Gestionar candidatos](./05-gestionar-candidatos.md)).

## ¿Cuándo pausar y cuándo cerrar una vacante?

- **Pausa** cuando esperas retomar la búsqueda: presupuesto pendiente de
  aprobación, ya tienes suficientes candidatos para evaluar por ahora, o
  necesitas liberar un cupo de vacante activa temporalmente. Los candidatos
  que ya aplicaron se conservan y puedes seguir gestionándolos.
- **Cierra** cuando el proceso terminó: ya contrataste, se canceló la
  búsqueda o el puesto cambió tanto que conviene publicar uno nuevo.

## ¿Puedo reabrir una vacante cerrada?

No. Cerrar una vacante es **definitivo** y no se puede deshacer. Si
necesitas volver a buscar para ese puesto, usa **Duplicar** sobre la vacante
cerrada para crear una nueva con los mismos datos (respetando el límite de
vacantes activas de tu plan). Si solo quieres detenerla un tiempo, usa
**Pausar** en vez de cerrar.

## ¿Existe "archivar" o "borrador" como estado?

No hay un estado "Archivada". Los estados son **Activa**, **Pausada** y
**Cerrada**. Una vacante **guardada como borrador** queda en estado
**Pausada** hasta que la actives.

## ¿Qué ven los candidatos según el estado?

- **Activa**: aparece en búsquedas y acepta postulaciones.
- **Pausada**: deja de mostrarse a los candidatos; no recibe postulaciones
  nuevas.
- **Cerrada**: el proceso terminó; los no seleccionados reciben un email de
  cierre.

## Cómo cerrar una vacante paso a paso

1. Ve a **Ofertas de Trabajo** (`/company/jobs`).
2. Entra a **Gestionar** la vacante.
3. Usa **Cerrar vacante** y confirma. Recuerda: no se puede deshacer.
4. Los candidatos no seleccionados reciben automáticamente el email de
   cierre.

## Buscar vacantes en el listado

En **Ofertas de Trabajo** hay un buscador por título o ubicación y la lista
muestra el estado de cada vacante.

# Entrevistas y calendario

## Cómo agendar una entrevista con un candidato

Las entrevistas se agendan desde la gestión de la vacante
(`/company/jobs/{id}/manage`), sobre el candidato:

1. Abre la vacante y ubica al candidato en la lista.
2. Usa la acción **Agendar entrevista**.
3. Completa los datos:
   - **Fecha** y **hora**.
   - **Tipo**: videollamada, presencial o telefónica.
   - **Entrevistador** (quién hará la entrevista).
   - **Lugar** (si es presencial) o **link de la reunión** (si es
     videollamada).
   - **Notas** adicionales.
4. Antes de confirmar, desde el mismo formulario puedes abrir el
   **calendario de la empresa** para revisar qué horarios ya están ocupados.
5. Confirma. El candidato recibe un **email** con los detalles de la
   entrevista (ver [Emails y notificaciones](./11-emails-y-notificaciones.md)).

## Cómo reprogramar una entrevista

Una entrevista ya agendada se puede **reprogramar** desde el mismo
candidato en la gestión de la vacante, cambiando fecha, hora u otros datos.

## Calendario de entrevistas

En el menú **Entrevistas** (`/interviews`) la empresa ve un calendario con
todas sus entrevistas:

- Vista **semanal** (lunes a domingo), con botones para ir a la semana
  anterior o siguiente.
- Cada día muestra cuántas entrevistas hay y el detalle de cada una
  (candidato, hora, tipo).
- Los tipos de entrevista se distinguen por color/ícono.

## Videollamadas: Zoom, Google Meet, Teams

La plataforma **no crea reuniones automáticamente** en Zoom, Google Meet ni
Microsoft Teams. Lo que se hace es **pegar el link** de la reunión (creada
por la empresa en la herramienta que use) en el campo de link al agendar la
entrevista de tipo videollamada. Ese link le llega al candidato en el email
de la entrevista.

## Sincronizar con Google Calendar u Outlook

Hoy **no existe** sincronización con Google Calendar, Outlook ni Apple
Calendar. El calendario de entrevistas vive solo dentro de EmpleoServicio.
Si la empresa usa otro calendario, debe registrar la entrevista allí
manualmente.

## Cómo calificar una entrevista (rúbrica)

Después de la entrevista, la empresa la califica desde el candidato en la
gestión de la vacante:

- Si la vacante tiene **rúbrica de entrevista**, se califica **cada
  criterio de 1 a 5 estrellas** y el sistema calcula un **puntaje final
  ponderado** según el peso (%) de cada criterio.
- Si la vacante no tiene rúbrica propia, se usan los criterios generales de
  la empresa con un **promedio simple**.
- En ambos casos se puede escribir una **observación**.

Además, en las **notas del reclutador** hay espacios para notas de primera,
segunda y tercera entrevista. Ver
[Gestionar candidatos](./05-gestionar-candidatos.md) y la rúbrica en
[Publicar una vacante](./03-publicar-vacante.md).

## Qué NO existe en entrevistas (no ofrecerlo)

- Auto-agendamiento por parte del candidato (que el candidato elija su
  horario entre opciones disponibles).
- Recordatorio automático 24 horas antes de la entrevista.
- Confirmación de asistencia por parte del candidato desde el email.
- Registro automático de asistencia.
- Integración con Google Calendar, Outlook, Zoom, Meet o Teams.

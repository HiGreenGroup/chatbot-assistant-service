# Preguntas frecuentes — Empresas

**¿Cómo me registro como empresa?**
Entra a `/auth/register` elige "Empresa", llena el formulario con los datos
de tu empresa (nombre, RNC, sector, email, contraseña), verifica el código
que te llega por email y elige un plan. Ver
[Registro y onboarding](./01-registro-y-onboarding.md).

**¿Qué plan necesito para usar Tests IA?**
Cualquiera excepto el plan Gratis: Básico MiPyme, Premium, Reclutador o
Enterprise. Ver [Planes y precios](./02-planes-y-precios.md).

**¿Cuántas vacantes puedo tener activas a la vez?**
Depende de tu plan: 1 en Gratis, 3 en Básico MiPyme, 10 en Premium, 50 en
Reclutador, a medida en Enterprise. Si llegas al límite, no puedes publicar
ni activar otra vacante hasta liberar espacio o subir de plan.

**¿Qué diferencia hay entre pausar y cerrar una vacante?**
Pausar la oculta temporalmente de los candidatos pero se puede reactivar
cuando quieras, sin perder nada. Cerrar la finaliza de forma permanente (no
se puede deshacer) y notifica automáticamente por email a los candidatos que
no fueron seleccionados.

**Si cierro una vacante, ¿se les avisa a los candidatos?**
Sí, a los candidatos **que no fueron seleccionados** se les notifica por
email automáticamente de que el proceso terminó.

**Si selecciono a un candidato, ¿se cierra la vacante automáticamente?**
No. Seleccionar a un candidato solo le notifica a él por email que fue
elegido; la vacante sigue abierta y puede seguir recibiendo y gestionando
otros candidatos normalmente.

**¿Puedo publicar una vacante sin escribir toda la descripción?**
Sí, puedes escribir solo el título del puesto y usar "Generar con IA" para
que la plataforma redacte la descripción, los requisitos y sugiera
habilidades automáticamente. Puedes editar todo antes de publicar.

**¿Qué es la rúbrica de entrevista y por qué no me deja guardarla?**
Es la lista de criterios con los que vas a calificar las entrevistas de esa
vacante (por ejemplo: Técnico, Comunicación, Experiencia). La suma de los
porcentajes de todos los criterios **tiene que ser exactamente 100%**, si no
suma 100% la plataforma no te deja guardar.

**¿Cómo comparto mi vacante en mis redes sociales?**
Desde la gestión de la vacante, usa el botón de compartir/publicar en redes.
Si ya tienes guardado el link de tu LinkedIn, Facebook o Instagram en tu
perfil de empresa, el sistema copia automáticamente el link de la vacante y
te muestra los pasos para pegarlo y publicarlo en esa red.

**¿Puedo tener varios usuarios de mi equipo administrando la cuenta?**
No todavía. La gestión de empleados/equipo no está disponible actualmente.

**¿Cómo pago mi plan?**
Con tarjeta (a través de Stripe, pago inmediato) o por transferencia
bancaria (debes subir el comprobante; la confirmación no es automática, se
revisa manualmente).

**¿Cómo cancelo mi suscripción?**
Desde `/company/plans` hay un botón "Cancelar suscripción" para cualquier
plan que no sea el gratis. Conservas el acceso a tu plan actual hasta que
termine el período ya pagado, y después pasas automáticamente al plan
gratis.

**¿Qué diferencia hay entre el puntaje de compatibilidad, el de la entrevista y el de un Test IA?**
Son tres cosas distintas: el **puntaje de compatibilidad** lo calcula la IA
comparando el perfil del candidato con la vacante (experiencia, educación,
habilidades). El **puntaje de entrevista** lo da el entrevistador calificando
según la rúbrica de esa vacante. El **resultado de un Test IA** es la
calificación de una prueba específica que le asignaste al candidato. Se
pueden usar los tres juntos para decidir, pero no son el mismo número.

**¿Cómo se calcula el puntaje de compatibilidad (match score)?**
Es un número de 0 a 100 que calcula la IA comparando el perfil del candidato
con la vacante, con estos pesos: experiencia 35%, habilidades técnicas 25%,
posiciones y funciones 15%, nivel académico 10%, certificaciones e idiomas
10% y habilidades blandas 5%. No usa edad, sexo, foto, nacionalidad ni
dirección. Ver [Match score](./09-match-score.md).

**¿Qué significa "Excelente", "Alto", "Medio", "Bajo" o "Muy bajo" en un candidato?**
Es la clasificación de su puntaje de compatibilidad: Excelente 90–100, Alto
75–89, Medio 60–74, Bajo 40–59 y Muy bajo 0–39.

**¿Qué significa que un candidato sea "elegible con validación" o "no elegible"?**
Se basa en los requisitos excluyentes de la vacante. "No elegible" = no
cumple al menos uno. "Elegible con validación" = falta información para
confirmar que los cumple; conviene validarlo en la entrevista. "Elegible" =
los cumple todos.

**¿Por qué un candidato tiene puntaje alto pero "confianza" baja?**
Porque a su perfil le faltan datos: las dimensiones sin información no
cuentan como cero, se excluyen del cálculo. El puntaje se ve bien, pero con
poca información; conviene validar con el candidato.

**¿Puedo reabrir una vacante que cerré?**
No, cerrar es definitivo. Usa "Duplicar" sobre la vacante cerrada para crear
una nueva con los mismos datos. Si solo quieres detenerla un tiempo, usa
"Pausar".

**¿Puedo archivar una vacante?**
No existe el estado "archivada". Los estados son Activa, Pausada y Cerrada.

**¿Se le avisa al candidato cuando lo preselecciono?**
No, preseleccionar no envía email. Sí se envía email cuando agendas una
entrevista, le envías una evaluación, lo seleccionas, le asignas un Test IA
o cierras la vacante (si no fue seleccionado).

**¿Me llega un email cuando alguien se postula a mi vacante?**
No. Hoy no hay alertas de nuevas postulaciones. Revisa los candidatos en
Ofertas de Trabajo → la vacante → Gestionar.

**¿Puedo personalizar los emails que reciben los candidatos?**
No, las plantillas de email son fijas. Lo que sí aparece en el email son los
datos que tú cargas, por ejemplo el lugar o link y las notas de la
entrevista.

**¿Se sincroniza el calendario con Google Calendar u Outlook?**
No. El calendario de entrevistas (menú Entrevistas) vive solo dentro de
EmpleoServicio.

**¿Puedo crear la reunión de Zoom, Meet o Teams desde la plataforma?**
No automáticamente. Crea la reunión en tu herramienta y pega el link al
agendar la entrevista de tipo videollamada; el candidato lo recibe por email.

**¿El candidato puede elegir el horario de su entrevista?**
No. La empresa define fecha y hora al agendar, y puede reprogramar después.

**¿Existe una shortlist o lista de favoritos?**
No como función separada. Usa "Preseleccionar" y filtra la lista de
candidatos por ese estado; usa las notas del reclutador para tus
comentarios.

**¿Puedo buscar candidatos que no se postularon a mis vacantes?**
No. Trabajas con quienes se postularon. Para atraer más, comparte la vacante
en redes y WhatsApp o destácala si tu plan lo permite.

**¿Puedo importar candidatos desde un Excel?**
No. Los candidatos deben postularse o registrarse ellos mismos en la
plataforma.

**¿Puedo exportar mis candidatos a Excel?**
No hay exportación masiva de candidatos. Sí puedes descargar el CV de cada
candidato, generar el PDF de su perfil, y exportar a CSV el historial de
envíos de Tests IA.

**¿Hay reportes de reclutamiento?**
Hay estadísticas por vacante (visitas, aplicaciones, entrevistas,
contrataciones) y un resumen en el Dashboard. No hay un módulo de reportes
con filtros por período, costo por contratación o ROI.

**¿Puedo invitar a mi equipo con roles (admin, reclutador, solo lectura)?**
No. Hoy cada empresa tiene un solo acceso y no hay roles. "Reclutador" es el
nombre de un plan, no un rol.

**¿EmpleoServicio se integra con mi sistema de nómina, CRM o ATS?**
No. Hoy no hay integraciones con HRIS, CRM, almacenamiento ni webhooks/API
para empresas.

**¿Ofrecen marca blanca (white-label)?**
No de autoservicio. Para acuerdos especiales escribe a
asistencia@empleoservicio.com.

**¿Hay prueba gratis?**
Existe el plan Gratis (permanente, 1 vacante activa). En los planes Gratis y
Básico MiPyme, algunas funciones superiores se pueden probar 30 días.

**¿Los tests IA tienen costo por uso o límite mensual?**
No hay cobro por test ni límite mensual publicado: Tests IA está incluido en
los planes Básico MiPyme, Premium, Reclutador y Enterprise. Cada test define
su máximo de intentos por candidato.

**¿Hay límite de candidatos por plan?**
No. Los planes limitan vacantes activas y destacadas, no candidatos.

**¿Mis datos y los de los candidatos están seguros?**
Sí: transmisión cifrada SSL/TLS, acceso restringido, monitoreo y copias de
seguridad regulares. Los datos se rigen por la Ley 172-13 de República
Dominicana. Ver [Seguridad y privacidad](./15-seguridad-y-privacidad.md).

**¿Hay verificación en dos pasos (2FA)?**
No. El acceso es con email y contraseña segura; el email se verifica con un
código OTP al registrarse.

**¿Cómo pido que se eliminen mis datos o los de mi empresa?**
Escribe a info@empleoservicio.com (derechos de acceso, rectificación y
supresión bajo la Ley 172-13).

**¿Qué pasa con mis datos si cancelo mi suscripción?**
No se borran: conservas el plan hasta el final del período pagado y luego
pasas al plan Gratis con tus datos. Para eliminar la cuenta, solicítalo por
email.

**¿Cómo contacto a soporte?**
Escribe a asistencia@empleoservicio.com o usa el formulario de Contacto del
sitio. El WhatsApp +1 (809) 697-5684 es solo para registro de candidatos.

**¿Cómo uso EmpleoServicio en una feria de empleo?**
Publica las vacantes antes, comparte el link de cada una (cartel, QR o
WhatsApp) para que los candidatos se postulen en el momento, y después
revisa a los candidatos por su puntaje de compatibilidad. Ver
[Contratación masiva y ferias](./16-contratacion-masiva-y-ferias.md).

**¿Puedo hacer acciones masivas sobre varios candidatos?**
No. Preseleccionar, descartar, asignar tests y agendar se hacen candidato
por candidato. Al cerrar la vacante, eso sí, todos los no seleccionados
reciben el email de cierre automáticamente.

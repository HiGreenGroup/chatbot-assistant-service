# Gestionar candidatos (pipeline de selección)

Esta es la parte más completa del panel de empresa, dentro de
`/company/jobs/{id}/manage`. Por cada vacante, la empresa ve la lista de
candidatos que aplicaron y puede moverlos a través de un proceso de
selección con varias etapas.

## Buscar y filtrar candidatos

- Búsqueda por nombre o email (mínimo 3 caracteres).
- Filtro por estado del candidato dentro del proceso.
- Filtro por fecha de entrevista.
- Lista paginada.
- Cada candidato muestra un indicador visual de en qué paso del proceso va,
  según los pasos personalizados que la propia empresa haya configurado para
  su flujo de contratación (workflow).

## Qué puede hacer la empresa con cada candidato

Las acciones disponibles cambian según en qué etapa está el candidato. En
términos generales, a lo largo del proceso una empresa puede:

1. **Ver el perfil completo** del candidato (CV, experiencia, datos de
   contacto, etc.) en un panel lateral rápido o en la página completa del
   candidato. La primera vez que una empresa abre el perfil de un candidato
   nuevo, el sistema registra automáticamente que "ya se vio su CV".
2. **Preseleccionar**: mueve al candidato a la siguiente etapa del proceso,
   con una nota opcional.
3. **Descartar**: requiere elegir un motivo de la lista (Salario fuera de
   rango, No cumple requisitos, Falta de experiencia, Perfil no encaja con la
   cultura, Otro) y permite agregar una nota adicional.
4. **Enviar evaluación**: la empresa puede pedirle al candidato una
   evaluación externa (técnica, psicológica, de competencias o de idiomas),
   aportando ella misma el link de esa prueba (por ejemplo, un formulario de
   Google o una herramienta externa). Esto es distinto de los
   [Tests IA](./06-tests-ia.md) propios de la plataforma — es un mecanismo
   más simple basado en links que la empresa ya tenga.
5. **Calificar evaluaciones**: una vez el candidato completó una evaluación
   de Tests IA asignada, aparece la opción de calificarla/revisarla.
6. **Agendar entrevista**: se define fecha, hora, tipo (videollamada,
   presencial o telefónica), entrevistador, lugar o link de la reunión, y
   notas. Desde el mismo modal se puede abrir el calendario completo de la
   empresa para revisar disponibilidad antes de confirmar. También se puede
   reprogramar una entrevista ya agendada.
7. **Calificar entrevistas**: si la vacante tiene una
   [rúbrica de evaluación](./03-publicar-vacante.md#rúbrica-de-entrevista)
   configurada, la calificación se hace **por cada criterio de la rúbrica**
   (de 1 a 5 estrellas) y el sistema calcula un **puntaje final ponderado**
   según el peso de cada criterio. Si la vacante no tiene rúbrica propia, se
   usan los criterios generales de la empresa en su lugar, con un promedio
   simple (sin ponderar). En ambos casos se puede agregar una observación
   escrita.
8. **Seleccionar**: marca al candidato como elegido para esa etapa/puesto, con
   una nota opcional. Al confirmar, **se le notifica automáticamente por
   email al candidato** — no se cierra la vacante ni deja de recibir otros
   candidatos por este motivo.
9. **Notas del reclutador**: además de la nota de cada acción puntual, hay un
   espacio de notas más estructurado por candidato (notas de primera,
   segunda y tercera entrevista, notas de evaluaciones y una nota general).
10. **Ver historial de notas del proceso**: un resumen cronológico de todo lo
    que se fue registrando en cada paso del workflow de esa empresa para ese
    candidato.
11. **Descargar o imprimir el perfil**: se puede abrir el CV subido
    directamente, generar un PDF con el resumen del perfil del candidato, o
    imprimirlo.

## Puntaje de compatibilidad (match score)

Cada candidato tiene un puntaje de compatibilidad calculado por IA frente a
la vacante específica, con un desglose por experiencia, educación y
habilidades, una clasificación (excelente / alto / medio / bajo / muy bajo) y
una elegibilidad (elegible / elegible con validación / no elegible), además
de fortalezas, brechas y datos que conviene validar con el candidato. Este
puntaje es **distinto** del puntaje de la entrevista (rúbrica) y distinto del
resultado de un Test IA — son tres medidas separadas que la empresa puede
usar juntas para decidir.

## Cerrar el proceso completo de una vacante

Además de cerrar la vacante en sí (ver
[Gestionar vacantes](./04-gestionar-vacantes.md)), existe la acción de
**cerrar el proceso**, que marca a la vez a todos los candidatos de esa
vacante como "finalizado".

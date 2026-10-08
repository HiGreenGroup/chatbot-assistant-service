# Tests IA

Página: `/company/tests`. **Disponible solo en los planes Básico MiPyme,
Premium, Reclutador y Enterprise** (no en el plan Gratis — ver
[Planes y precios](./02-planes-y-precios.md)). Si una empresa sin acceso
intenta entrar, ve una pantalla explicando que necesita mejorar su plan.

Es un banco de pruebas/evaluaciones propio de la empresa, con 4 secciones:

## 1. Asignar e invitar

1. La empresa elige una de sus vacantes.
2. Ve la lista de candidatos que aplicaron a esa vacante.
3. Para cada candidato, puede **asignar un test** de su biblioteca (no se
   pueden asignar tests que ya llegaron al máximo de intentos permitidos).
4. Al asignar, se le envía automáticamente un **email de invitación** al
   candidato con el test.
5. Se puede **reenviar el email** de invitación si es necesario.
6. Se puede filtrar la lista de candidatos entre los que ya tienen test
   asignado y los que no, y buscar por nombre o email.
7. Para cada asignación se ve cuántos intentos ha usado el candidato de los
   permitidos, y su estado.
8. "Ver resultados" lleva al detalle de la evaluación de ese candidato.

## 2. Biblioteca (banco de tests propio)

- **Crear con IA**: la empresa da una guía de lo que quiere evaluar, la IA
  genera una propuesta de prompt optimizado, y a partir de eso genera el test
  completo (preguntas, opciones, puntuación). El resultado se puede revisar y
  editar antes de guardar.
  - Hay dos tipos de evaluación con IA:
    - **Clásica**: preguntas con una respuesta correcta.
    - **DISC**: evaluación de personalidad (dimensiones Dominancia,
      Influencia, Estabilidad, Cumplimiento) donde cada opción tiene un peso
      del 1 al 5 en vez de una respuesta "correcta".
- **Crear test manual**: constructor clásico de preguntas, sin IA.
- Importar/exportar tests en formato JSON.
- Editar o eliminar tests propios — los tests compartidos/del sistema (que
  no son propiedad de la empresa) no se pueden editar ni eliminar.
- Cada test define: intentos máximos permitidos, duración en minutos,
  dificultad, sector/categoría y cantidad de preguntas.

## 3. Comparar candidatos

La empresa elige **dos o más candidatos** que ya completaron algún test
(opcionalmente filtrando por una vacante) y pide una comparación con IA.
El resultado incluye:

- Un ranking de los candidatos comparados.
- Una recomendación escrita.
- Un gráfico de radar con el desglose de cada candidato por dimensión
  evaluada.

## 4. Envíos (historial)

Historial de todos los intentos de test realizados, con posibilidad de
exportar a CSV y gestionar reintentos.

## ¿Qué tipos de tests puedo usar?

- **Tests clásicos** (con respuesta correcta): sirven para conocimientos
  técnicos del puesto, razonamiento, idiomas, situaciones de trabajo, etc.
  La empresa define el tema al crearlos con IA o a mano.
- **Tests DISC** (personalidad): miden Dominancia, Influencia, Estabilidad y
  Cumplimiento.
- Tests **compartidos del sistema** disponibles en la biblioteca (se pueden
  usar, pero no editar ni eliminar).

## ¿Cuándo conviene asignar un test?

- A candidatos **preseleccionados** o con buena clasificación de puntaje,
  para no saturar a quienes no van a avanzar.
- **DISC** cuando el ajuste de personalidad/estilo de trabajo es importante
  (atención al cliente, liderazgo, ventas).
- **Tests técnicos o de idiomas** cuando el puesto requiere una habilidad
  que conviene comprobar (por ejemplo, inglés para recepción).
- No hace falta asignar todos los tests a todos: elige según el puesto.

## ¿Los tests tienen costo adicional?

No hay cobro por test publicado. El acceso a Tests IA viene incluido en los
planes **Básico MiPyme, Premium, Reclutador y Enterprise**. No hay un límite
mensual de tests publicado por plan; cada test define su propio **número
máximo de intentos** por candidato.

## ¿Qué recibo cuando un candidato completa un test?

En "Ver resultados" del candidato ves su calificación y el detalle de la
evaluación. En **Comparar candidatos** puedes pedir a la IA un ranking,
una recomendación escrita y un gráfico de radar por dimensión entre dos o
más candidatos. En **Envíos** tienes el historial de intentos, exportable a
CSV.

## ¿Puedo asignar un test a muchos candidatos a la vez?

No. Los tests se asignan **candidato por candidato** desde "Asignar e
invitar".

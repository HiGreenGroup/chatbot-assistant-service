# Publicar una vacante

Página: `/company/publish`.

## Límite de vacantes activas

Antes de poder publicar, la plataforma revisa el límite de vacantes activas
del plan de la empresa (ver [Planes y precios](./02-planes-y-precios.md)).
Si ya alcanzó el límite, al intentar publicar se le muestra un aviso —
"Has alcanzado el límite de N oferta(s) activa(s)..." — con un botón para
ir a mejorar su plan. No puede publicar una vacante adicional activa hasta
que libere espacio (cerrando/pausando otra) o suba de plan.

## Llenar el formulario manualmente

Campos obligatorios para poder publicar:

- Título de la vacante.
- Descripción completa.
- Sector.
- Departamento.
- Tipo de contrato.
- Experiencia requerida.
- Modalidad (presencial, remoto o híbrido).
- País y ciudad.
- Al menos un número mínimo de **habilidades** (skills) — si faltan, el
  mensaje de error indica cuántas hacen falta como mínimo.

Si falta algún campo obligatorio, la plataforma muestra un solo aviso
listando todo lo que falta, en vez de uno por uno.

Campos opcionales / adicionales:

- **Salario**: mínimo y máximo, con un interruptor para decidir si el salario
  se muestra públicamente a los candidatos o no.
- **Confidencial**: si se marca, el nombre y el logo de la empresa no se
  muestran públicamente en esa vacante.
- **Destacada**: resalta la vacante para que tenga más visibilidad — sujeta
  al cupo de vacantes destacadas del plan (ver planes).
- Idiomas requeridos, certificaciones, beneficios, posiciones/roles
  relacionados (hasta 5).
- Duración de la publicación.

## Generar la vacante con IA

En vez de llenar todo a mano, la empresa puede escribir solo el **título del
puesto** y presionar "Generar con IA". La plataforma entonces:

1. Analiza el título.
2. Redacta la descripción.
3. Define los requisitos clave.
4. Sugiere habilidades y posiciones relacionadas.
5. Ajusta todo al catálogo de la plataforma (sectores, departamentos, etc.
   existentes).

El resultado llena automáticamente el formulario, que la empresa puede
revisar y editar libremente antes de publicar.

## Rúbrica de entrevista

Cada vacante tiene su propia **rúbrica de evaluación de entrevista**: una
lista de criterios con un peso en porcentaje cada uno (por ejemplo: Técnico
40%, Comunicación 30%, Experiencia 30% — esos son los valores por defecto).

- **Regla obligatoria: la suma de los pesos debe ser exactamente 100%** para
  poder guardar la rúbrica. Si no suma 100%, la plataforma no permite
  guardar y muestra el total en rojo.
- Esta rúbrica es la que se usa después para calificar las entrevistas de
  cada candidato a esa vacante (ver
  [Gestionar candidatos](./05-gestionar-candidatos.md)).
- También se puede editar la rúbrica más adelante sin tener que volver a
  editar toda la vacante, desde el botón **"Rúbrica"** disponible en la
  gestión de esa vacante.

## Publicar vs. guardar como borrador

Al terminar el formulario, la empresa puede:

- **Publicar** la vacante (queda activa de inmediato, visible a candidatos).
- **Guardar como borrador** (queda pausada; se puede activar más tarde desde
  "Mis ofertas").

Al publicar con éxito se abre un diálogo para **compartir** la vacante en
redes sociales (ver [Gestionar vacantes](./04-gestionar-vacantes.md)).

## Duplicar una vacante existente

Desde el listado de vacantes, la opción "Duplicar" abre el formulario de
publicación pre-llenado con todos los datos (incluida la rúbrica) de una
vacante ya existente, para que la empresa solo tenga que ajustar lo que
cambie en vez de empezar de cero. También respeta el límite de vacantes
activas del plan.

## Buenas prácticas para escribir una vacante efectiva

- **Título específico**: "Recepcionista bilingüe" funciona mejor que
  "Personal administrativo". El título también es lo que usa "Generar con
  IA".
- **Responsabilidades claras**: 5–7 puntos principales, sin jerga interna.
- **Requisitos realistas**: pide solo la experiencia, títulos e idiomas
  realmente necesarios. Pedir de más baja el puntaje de compatibilidad de
  candidatos que sí podrían hacer el trabajo (ver
  [Match score](./09-match-score.md)).
- **Habilidades bien elegidas**: son una parte importante del cálculo del
  puntaje de compatibilidad.
- **Salario**: indicar un rango (aunque decidas no mostrarlo públicamente)
  ayuda a filtrar expectativas; mostrarlo suele atraer más postulaciones.
- **Beneficios**: menciona lo que te diferencia (capacitación, transporte,
  comida, crecimiento).
- **Revisa ortografía y redacción** antes de publicar.
- **Configura la rúbrica** de entrevista desde el inicio, para calificar a
  todos los candidatos con los mismos criterios.

## ¿Cuánto tarda en verse una vacante publicada?

Al publicar, la vacante queda **activa de inmediato** y visible para los
candidatos.

# Puntaje de compatibilidad (Match Score)

## Qué es el puntaje de compatibilidad

El puntaje de compatibilidad (match score) es un número de **0 a 100** que
indica qué tanto se ajusta el perfil de un candidato a una vacante
específica. Lo calcula automáticamente la inteligencia artificial de
EmpleoServicio comparando el perfil del candidato (CV, experiencia,
educación, habilidades, certificaciones e idiomas) con los requisitos de la
vacante.

- Se calcula **por candidato y por vacante**: el mismo candidato puede tener
  puntajes distintos en dos vacantes diferentes.
- Está incluido en **todos los planes**, incluido el Gratis.
- Se ve en la lista de candidatos de cada vacante y en el perfil del
  candidato dentro de la gestión de la vacante.

## Cómo se calcula: dimensiones y pesos

El puntaje final es un promedio ponderado de seis dimensiones:

| Dimensión | Peso |
|---|---|
| Experiencia (años relevantes, estabilidad, progresión, coherencia con el cargo y el sector) | 35% |
| Habilidades técnicas | 25% |
| Posiciones y funciones desempeñadas (qué tan parecido es lo que ha hecho al puesto) | 15% |
| Nivel académico | 10% |
| Certificaciones e idiomas | 10% |
| Habilidades blandas | 5% |

Cada requisito de la vacante se evalúa con un nivel de coincidencia, por
ejemplo: **cumple**, **cumple equivalente** (cumple con algo equivalente),
**adyacente** (relacionado pero no igual), **parcial**, **débil**,
**no cumple** o **no determinado**. Los requisitos marcados como
obligatorios/excluyentes pesan el doble que los deseables.

Las habilidades se comparan **por significado** (equivalencia semántica), no
solo por el nombre exacto: si la vacante pide "atención al cliente" y el
candidato tiene "servicio al cliente", cuenta.

Si la vacante no pide años de experiencia (por ejemplo, "Sin experiencia"),
el candidato sin historial laboral **no es penalizado** por eso.

## Qué pasa si falta información del candidato

Si el perfil del candidato no tiene datos suficientes para evaluar una
dimensión (por ejemplo, no indicó su nivel académico), esa dimensión **no se
cuenta como cero**: se excluye del cálculo y el puntaje se reparte entre las
dimensiones que sí se pudieron evaluar.

Por eso el resultado incluye también un **nivel de confianza de la
evaluación** (0–100): mientras más dimensiones se pudieron evaluar, mayor es
la confianza. Un puntaje alto con confianza baja significa "se ve bien, pero
con poca información" — conviene validar con el candidato.

## Clasificación del puntaje (excelente, alto, medio, bajo, muy bajo)

| Puntaje | Clasificación | Sugerencia de uso |
|---|---|---|
| 90–100 | **Excelente** | Muy buen ajuste. Priorízalo para contacto/entrevista. |
| 75–89 | **Alto** | Buen ajuste con brechas menores. Considéralo seriamente. |
| 60–74 | **Medio** | Ajuste razonable; revisa las brechas antes de avanzar. |
| 40–59 | **Bajo** | Le faltan varios requisitos clave. |
| 0–39 | **Muy bajo** | No se ajusta a esta vacante. |

Las sugerencias de uso son recomendaciones; la decisión siempre es de la
empresa.

## Elegibilidad (elegible, elegible con validación, no elegible)

Además del puntaje, cada candidato recibe una **elegibilidad** basada en los
requisitos **excluyentes** de la vacante:

- **Elegible**: cumple todos los requisitos excluyentes (o la vacante no
  tiene requisitos excluyentes).
- **Elegible con validación**: no hay evidencia de que incumpla un requisito
  excluyente, pero falta información para confirmarlo. Hay que validarlo con
  el candidato (por ejemplo, en la entrevista).
- **No elegible**: no cumple al menos un requisito excluyente.

Un candidato puede tener un puntaje alto y aun así ser "no elegible" si
falla un requisito excluyente (por ejemplo, una licencia obligatoria).

## Qué más muestra el análisis de compatibilidad

Junto con el número, el análisis incluye:

- **Desglose por dimensión**: experiencia, educación y habilidades.
- **Fortalezas** del candidato frente a la vacante.
- **Brechas** principales (lo que le falta).
- **Datos por validar**: puntos que conviene confirmar con el candidato.

## Anti-sesgo: qué NO usa el puntaje

El puntaje de compatibilidad **no usa** la edad, el sexo, la foto, la
nacionalidad ni la dirección del candidato para clasificarlo. Tampoco
inventa experiencia, estudios ni habilidades que no estén en el perfil: si no
hay evidencia, el dato queda como "no determinado".

## ¿El puntaje es lo único que debo mirar?

No. El puntaje de compatibilidad sirve para **priorizar**, pero es una de
tres medidas distintas que la empresa puede usar juntas:

1. **Puntaje de compatibilidad** (este): lo calcula la IA comparando perfil
   vs. vacante.
2. **Puntaje de entrevista**: lo pone el entrevistador según la rúbrica de la
   vacante (ver [Gestionar candidatos](./05-gestionar-candidatos.md)).
3. **Resultado de Tests IA**: la calificación de una prueba que la empresa le
   asignó al candidato (ver [Tests IA](./06-tests-ia.md)).

También conviene considerar la motivación, la disponibilidad, las
expectativas salariales y el ajuste cultural.

## Cómo mejorar los puntajes de los candidatos de mi vacante

Si muy pocos candidatos obtienen puntajes altos, suele ayudar revisar la
vacante:

- Que los requisitos sean realistas (no pedir más años o títulos de lo
  necesario).
- Marcar como excluyente solo lo verdaderamente indispensable.
- Que las habilidades listadas describan bien el puesto.
- Que la descripción sea clara y específica.

## Qué NO existe del puntaje (no ofrecerlo)

- No hay alertas automáticas filtradas por puntaje (por ejemplo, "avísame
  solo si el puntaje es mayor a 80").
- No hay un reporte de distribución de puntajes por vacante ni comparativas
  históricas de puntajes.

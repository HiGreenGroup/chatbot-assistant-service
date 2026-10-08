# Especificación: contexto de página para el Asistente Virtual

**Para:** desarrollador(a) del backend del chatbot (`chatbot.empleoservicio.com`).
**De:** frontend (`fe-empleo-servicio`).
**Estado:** el frontend YA manda estos campos nuevos en cada request a
`POST /chat`. El backend todavía no los usa — este documento especifica
exactamente qué llega y qué se espera que el backend haga con eso.

---

## 1. Qué cambió

Antes, cada mensaje del widget mandaba solo `role` y `userId` dentro de
`context`. Ahora **además** manda en qué pantalla de la app está la persona
que está chateando: la ruta exacta (`pathname`), una etiqueta legible de esa
pantalla (`pageLabel`) y, cuando aplica, el ID de la entidad que está viendo
(`jobId` o `candidateId`).

Esto es **aditivo**: los campos viejos (`role`, `userId`) siguen llegando
igual. No hay breaking changes en el contrato existente.

## 2. Endpoint y forma exacta del request

`POST {ASSISTANT_API_URL}/chat`

```json
{
  "message": "¿cómo publico una vacante?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "context": {
    "role": "company",
    "userId": "c3f1a2b0-...",
    "pathname": "/company/jobs/abc123/manage",
    "pageLabel": "Gestión de vacante (candidatos)",
    "jobId": "abc123"
  }
}
```

### 2.1. Campos de `context` (todos opcionales salvo `role`)

| Campo | Tipo | Siempre presente | Descripción |
|---|---|---|---|
| `role` | `"candidate" \| "company" \| "anonymous"` | Sí | Tipo de usuario autenticado. `"anonymous"` si no hay sesión. |
| `userId` | `string \| undefined` | No | ID del candidato o de la empresa. `undefined` si `role` es `"anonymous"`, o si el usuario está autenticado pero el objeto de usuario aún no cargó en el momento del mensaje. |
| `pathname` | `string \| null` | Sí (puede ser `null`) | Ruta exacta del navegador en el momento de enviar el mensaje, ej. `"/company/jobs/abc123/manage"`. Es la URL real tal cual, **sin** dominio ni query string. `null` solo en el render inicial antes de que Next.js resuelva la ruta (caso raro, tratar como "página desconocida"). |
| `pageLabel` | `string \| undefined` | No | Etiqueta humana de la pantalla (ver tabla completa en §3). `undefined` si la ruta no coincide con ningún patrón conocido (rutas nuevas que el frontend todavía no mapeó, o páginas públicas no cubiertas). **No asumir que siempre viene.** |
| `jobId` | `string \| undefined` | No | Solo presente cuando `pathname` corresponde a una pantalla relacionada a **una vacante específica** (gestión, edición, detalle, tests). Es el ID de la oferta de empleo tal como aparece en la URL. |
| `candidateId` | `string \| undefined` | No | Solo presente cuando `pathname` corresponde a una pantalla de **un candidato específico** (perfil, resultados de test). Es el ID del candidato tal como aparece en la URL. |

`jobId` y `candidateId` **nunca vienen los dos a la vez** en la forma actual
del frontend (cada pantalla mapeada es de una vacante o de un candidato, no
de ambos simultáneamente).

### 2.2. Ejemplos reales de payloads por pantalla

**Empresa viendo el listado de vacantes:**
```json
"context": { "role": "company", "userId": "co_123", "pathname": "/company/jobs", "pageLabel": "Mis vacantes" }
```

**Empresa gestionando candidatos de una vacante puntual:**
```json
"context": { "role": "company", "userId": "co_123", "pathname": "/company/jobs/abc123/manage", "pageLabel": "Gestión de vacante (candidatos)", "jobId": "abc123" }
```

**Empresa viendo el perfil de un candidato:**
```json
"context": { "role": "company", "userId": "co_123", "pathname": "/company/candidates/cand789", "pageLabel": "Perfil de candidato", "candidateId": "cand789" }
```

**Empresa en una pantalla que el frontend todavía no mapeó** (ej. una futura
página nueva):
```json
"context": { "role": "company", "userId": "co_123", "pathname": "/company/alguna-pagina-nueva", "pageLabel": undefined }
```
→ en JSON real, `pageLabel` simplemente **no aparece como clave** (se omite,
no se manda como `null`). El backend debe tratar su ausencia igual que si
viniera vacío.

**Visitante anónimo en el buscador público de empleos:**
```json
"context": { "role": "anonymous", "pathname": "/jobs", "pageLabel": "Buscador de empleos" }
```

## 3. Tabla completa de `pageLabel` posibles (hoy)

Esta es la lista cerrada de valores que `pageLabel` puede tomar **hoy**. Va a
crecer con el tiempo (ver §5), así que el backend debe tener un
**comportamiento por defecto razonable para valores que no reconozca**, no
una lista hardcodeada que rompa si aparece uno nuevo.

| `pageLabel` | Ruta (patrón) | Trae `jobId` | Trae `candidateId` |
|---|---|---|---|
| Gestión de vacante (candidatos) | `/company/jobs/:id/manage` | ✅ | |
| Editar vacante | `/company/jobs/:id/edit` | ✅ | |
| Tests de una vacante | `/company/jobs/:id/tests` | ✅ | |
| Detalle de vacante | `/company/jobs/:id/detail` o `/company/jobs/:id` | ✅ | |
| Mis vacantes | `/company/jobs` | | |
| Publicar vacante | `/company/publish` | | |
| Resultados de test de un candidato | `/company/candidates/:id/tests` | | ✅ |
| Comparar candidatos | `/company/candidates/compare` | | |
| Perfil de candidato (vista empresa) | `/company/candidates/:id` | | ✅ |
| Tests IA | `/company/tests` | | |
| Planes y precios | `/company/plans` | | |
| Pago/checkout de plan | `/company/check-out` | | |
| Perfil de empresa | `/company/profile` | | |
| Gestión de empleados | `/company/employees` | | |
| Panel principal de empresa | `/company` | | |
| Perfil de candidato (vista candidato) | `/user/profile` | | |
| Mis aplicaciones | `/user/applications` | | |
| Panel principal de candidato | `/user` | | |
| Detalle público de vacante | `/jobs/:id` | ✅ (es el mismo `jobId`) | |
| Buscador de empleos | `/jobs` | | |

> ⚠️ Nota: en "Detalle público de vacante" el `jobId` es el ID de la vacante
> vista públicamente por un candidato o visitante anónimo — **no asumir que
> `jobId` implica `role: "company"`**. Revisar siempre `role` junto con
> `jobId`/`candidateId`, nunca uno sin el otro.

El código fuente de esta tabla (fuente de verdad, por si se actualiza) está
en `components/shared/AssistantWidget.tsx`, constante `PAGE_LABEL_PATTERNS`.

## 4. Qué se espera que haga el backend con esto

### 4.1. Uso mínimo (obligatorio)

Inyectar `pageLabel` (y `jobId`/`candidateId` si vienen) en el prompt de
sistema o en el contexto que se le da al modelo antes de generar la
respuesta, por ejemplo:

```
Contexto de la conversación: el usuario es una EMPRESA y está actualmente
en la pantalla "Gestión de vacante (candidatos)" (vacante id abc123).
```

Esto permite que el asistente responda cosas como "¿cómo cierro esta
vacante?" entendiendo que "esta" se refiere a la vacante `abc123`, sin que
el usuario tenga que repetir en qué pantalla está o de qué vacante habla.

### 4.2. Uso recomendado (ideal, no bloqueante)

1. **Priorizar la base de conocimiento según la pantalla actual.** Ya existe
   documentación estructurada en
   `docs/knowledge-base/empresas/*.md` (ver §6) pensada exactamente para
   esto. Se recomienda mapear cada `pageLabel` al documento más relevante y
   dárselo con más peso en la búsqueda/retrieval que el resto de la base de
   conocimiento. Ejemplo de mapeo sugerido:

   | `pageLabel` | Documento más relevante |
   |---|---|
   | Mis vacantes / Detalle de vacante / Editar vacante | `04-gestionar-vacantes.md` |
   | Publicar vacante | `03-publicar-vacante.md` |
   | Gestión de vacante (candidatos) / Perfil de candidato / Comparar candidatos | `05-gestionar-candidatos.md` |
   | Tests IA / Tests de una vacante / Resultados de test de un candidato | `06-tests-ia.md` |
   | Planes y precios / Pago/checkout de plan | `02-planes-y-precios.md` |
   | Perfil de empresa / Panel principal de empresa / Gestión de empleados | `01-registro-y-onboarding.md` |

2. **Usar `jobId`/`candidateId` para enriquecer la respuesta con datos
   reales**, si el backend tiene (o puede obtener) acceso a la API interna:
   por ejemplo, si la empresa pregunta "¿por qué no puedo activar esta
   vacante?" estando en `pathname` con `jobId`, el backend podría consultar
   el estado real de esa vacante (límite de plan, estado actual) y dar una
   respuesta específica en vez de genérica. **Esto es opcional** — el
   contrato mínimo (§4.1) ya mejora mucho la respuesta sin necesidad de
   hacer esa llamada adicional.

3. **No confiar ciegamente en `jobId`/`candidateId` para autorizar nada.**
   Estos valores vienen del navegador del usuario (de la URL), no están
   firmados ni verificados. Si el backend los usa para consultar datos, debe
   seguir validando que el `userId` autenticado tenga permiso sobre ese
   `jobId`/`candidateId` igual que lo haría cualquier otro endpoint — nunca
   asumir que "si vino en el contexto, el usuario tiene acceso".

### 4.3. Manejo de casos borde (obligatorio)

- Si `pageLabel` **no viene** (ruta no mapeada) o `pathname` es `null`:
  responder igual, sin contexto de pantalla — comportamiento idéntico al
  actual (antes de este cambio). No tratarlo como error.
- Si `role` es `"anonymous"`: no asumir `userId`, `jobId` ni `candidateId`
  como datos de una cuenta — son, cuando existen, IDs de contenido público
  (ej. una vacante pública que el visitante está viendo), no de una sesión.
- Los valores de `pageLabel` son **texto fijo en español**, pensados para
  pegarse directo en un prompt. No se traducen ni tienen i18n por ahora.

## 5. Compatibilidad hacia adelante

Esta lista de `pageLabel` **va a crecer** a medida que se mapeen más
pantallas (candidato, admin, etc.) o se agreguen pantallas nuevas. El
backend **no debe** usar un `switch`/enum cerrado que falle o ignore el
mensaje ante un valor desconocido — debe degradar con gracia (tratar como
"sin contexto de pantalla específico" o, como mínimo, pasar el string crudo
de `pageLabel`/`pathname` al modelo tal cual, aunque no esté en una lista
reconocida).

## 6. Dónde está la base de conocimiento de referencia

`docs/knowledge-base/empresas/` en el repo `fe-empleo-servicio`, con un
`README.md` como índice. Cubre (por ahora) solo el lado de empresas:
registro, planes, publicar vacantes, gestionar vacantes, gestionar
candidatos, Tests IA y un FAQ. Están escritos específicamente para que un
asistente los use como fuente de verdad — cada afirmación corresponde a
comportamiento real verificado en el código, no a aspiraciones de producto.
Próximamente se agregará la parte de candidatos y, más adelante, admin.

## 7. Referencia del código fuente (frontend)

- `components/shared/AssistantWidget.tsx` — construye y envía el payload
  descrito en este documento. Función `resolvePageContext()` + constante
  `PAGE_LABEL_PATTERNS` son la fuente de verdad de §3.
- El widget está montado globalmente (visible en toda la app para
  candidatos, empresas y visitantes anónimos), así que el backend puede
  recibir este contexto desde cualquier `role`.

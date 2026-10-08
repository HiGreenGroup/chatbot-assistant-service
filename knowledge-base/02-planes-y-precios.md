# Planes y precios para empresas

La plataforma tiene 5 planes para empresas. Cada uno tiene una versión
mensual y una versión anual (la anual se cobra con un descuento equivalente
a un precio mensual más bajo).

| Plan | Vacantes activas | Vacantes destacadas | Tests IA | Contacto directo por WhatsApp | Panel de reclutamiento / calendario / BD de candidatos |
|---|---|---|---|---|---|
| **Gratis** (`company_free`) | 1 | 0 | ❌ | ❌ | ❌ |
| **Básico MiPyme** (`company_basic_mipyme`) | 3 | 0 | ✅ | ❌ | ❌ |
| **Premium** (`company_premium`) | 10 | 1 | ✅ | ✅ | ✅ |
| **Reclutador** (`company_recruiter`) | 50 | 3 | ✅ | ✅ | ✅ |
| **Enterprise** (`company_enterprise`) | A medida | A medida | ✅ | ✅ | ✅ |

Todos los planes incluyen: puntaje de compatibilidad (match score) con cada
candidato, un listado de "candidatos top" por vacante, y el logo de la
empresa visible en sus vacantes.

- El plan **Enterprise** es a cotización ("Cotizar"): no tiene checkout de
  autoservicio, un asesor comercial define el precio.
- En los planes **Gratis** y **Básico MiPyme**, las funciones que no están
  incluidas (destacadas, WhatsApp, panel de reclutamiento, etc.) se muestran
  como disponibles solo por un período de prueba y luego **se desactivan a
  los 30 días** si la empresa no sube de plan.

## "Vacante destacada" (featured)

Una vacante destacada aparece con más visibilidad para los candidatos. El
número de vacantes que se pueden destacar al mismo tiempo depende del plan
(0 en gratis/básico, 1 en premium, 3 en reclutador, a medida en enterprise).
Si una empresa intenta destacar una vacante sin cupo disponible, la
plataforma le muestra el error correspondiente y la invita a mejorar su
plan.

## Cómo se elige y se paga un plan

1. **Al registrarse**: la selección de plan es un paso obligatorio del
   registro (no se puede omitir). Elegir el plan gratis activa la cuenta de
   inmediato; elegir un plan de pago lleva al checkout.
2. **Checkout** (`/company/check-out`):
   - Se llenan los datos de facturación (nombre, email, país, dirección,
     ciudad — por defecto República Dominicana).
   - Se elige el método de pago:
     - **Tarjeta (Stripe)**: se abre el checkout seguro de Stripe en una
       pestaña nueva.
     - **Transferencia bancaria**: la empresa debe **subir un comprobante de
       pago** (archivo) antes de poder confirmar. Esta vía **no se verifica
       automáticamente** — queda pendiente de confirmación manual por parte
       del equipo de EmpleoServicio, no es instantánea como la tarjeta.
3. **Cambiar de plan después de registrada** (`/company/plans`):
   - Se puede ver la comparación completa de planes ahí mismo.
   - Pasar de un plan de pago a **otro plan de pago**: se trata como una
     actualización de suscripción (no un checkout nuevo).
   - Pasar de un plan de pago al **plan gratis**: se muestra como "cancelar
     suscripción" — la empresa conserva el acceso al plan actual hasta que
     termine el período ya pagado, y luego pasa automáticamente al plan
     gratis.
   - Hay un botón de **"Cancelar suscripción"** visible para cualquier
     empresa que no esté en el plan gratis.

## Tests IA y el plan

El acceso a la sección de **Tests IA** (`/company/tests`) está habilitado
para los planes Básico MiPyme, Premium, Reclutador y Enterprise. El plan
Gratis **no** tiene acceso; si una empresa en plan gratis intenta entrar, ve
una pantalla explicando que necesita mejorar su plan, con un botón para ver
los planes disponibles.

# Registro y onboarding de una empresa

## Cómo se registra una empresa

1. La empresa va al formulario de registro (`/auth/register?tipo=empresa`,
   accesible desde `/auth/register/company`) y llena:
   - **Nombre de la empresa** (2–100 caracteres).
   - **Sector** (lista desplegable, viene del catálogo de sectores).
   - **RNC / número fiscal** ("cif"): solo dígitos, máximo 9 caracteres.
   - **Cantidad de empleados** (rango).
   - **Email** de contacto (se valida formato).
   - **Teléfono** (opcional, pero si se llena se valida como teléfono
     dominicano).
   - **Contraseña**: mínimo 8 caracteres, debe incluir mayúscula, minúscula,
     número y símbolo. Hay un medidor de fortaleza en vivo.
   - **Confirmar contraseña** (debe coincidir).
   - Aceptar **Términos de servicio y política de privacidad** (checkbox
     obligatorio).
2. Al enviar el formulario, la plataforma envía un **código OTP de 6 dígitos**
   al email de la empresa.
   - El código expira a los **5 minutos**.
   - Hay un máximo de **5 intentos fallidos**, después de los cuales se
     bloquea el reintento por 5 minutos.
   - Se puede reenviar el código una vez que expiró.
3. Verificado el OTP, la plataforma marca que la empresa **debe elegir un
   plan** (este paso no se puede saltar) y la lleva a
   `/auth/select-plan?tipo=empresa`.
4. En esa pantalla la empresa elige un plan (ver
   [Planes y precios](./02-planes-y-precios.md)):
   - Si elige el **plan gratis**, se completa la selección y entra directo a
     su panel (`/company`).
   - Si elige un **plan de pago**, pasa a `/company/check-out` para completar
     el pago antes de poder usar la cuenta con ese plan.
5. Una vez dentro, si el perfil de la empresa está incompleto, aparece un
   **modal de onboarding de 3 pasos**:
   1. Completar el perfil de la empresa.
   2. Subir el logo.
   3. Publicar su primera vacante.

## Primer ingreso al panel (`/company`)

El panel principal de la empresa muestra:

- Un aviso para completar el perfil (si aplica) o para mejorar el plan (si
  está en el plan gratis).
- Un resumen de su perfil y su plan actual.
- Estadísticas rápidas: vacantes activas, cantidad de candidatos, contrataciones.
- Sus vacantes publicadas más recientes.

## Perfil de la empresa (`/company/profile`)

La empresa puede editar en cualquier momento:

- Datos generales (nombre, sector, cantidad de empleados, descripción, año de
  fundación, país/ciudad).
- Datos de contacto (email, teléfono, dirección, sitio web).
- Logo de la empresa.
- **Redes sociales**: LinkedIn, Facebook, X/Twitter, Instagram. Estos campos
  son solo para que la empresa guarde el link de su propia red social (se
  usan, por ejemplo, para armar las instrucciones de "publicar vacante en mis
  redes" — ver [Gestionar vacantes](./04-gestionar-vacantes.md)). En la vista
  de solo lectura del perfil se muestran como **texto**, no como links
  clicables — la empresa no necesita "entrar" a su propia red social desde
  ahí, ya tiene acceso directo a ella por su cuenta.

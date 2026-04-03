# Privacidad en el Ecosistema de Credenciales Verificables

## Principio

La digitalización de la licencia de conducir no puede significar más exposición de datos personales. Al contrario — una credencial verificable bien diseñada protege al ciudadano **mejor** que el documento físico, porque le permite demostrar lo que necesita sin revelar lo que no.

Este documento describe cómo la arquitectura SSI protege los datos del ciudadano en cada interacción del ecosistema vial.

---

## 1. Divulgación Selectiva — El Ciudadano Controla Qué Comparte

Una licencia física expone todos los datos impresos a cualquier persona que la vea: nombre completo, cédula, dirección, fecha de nacimiento, restricciones médicas, foto. No hay forma de mostrar solo lo necesario.

Con una credencial verificable bajo ISO 18013-5, el ciudadano presenta **solo los atributos requeridos** para cada contexto:

```
  Control de tránsito
  ───────────────────
  El oficial solicita:  licencia válida + categoría + restricciones
  El ciudadano comparte: exactamente eso
  El oficial NO ve:     dirección, cédula completa, historial de infracciones

  Rent-a-car
  ──────────
  La empresa solicita:  nombre + categoría + vigencia
  El ciudadano comparte: exactamente eso
  La empresa NO ve:     dirección, restricciones médicas, número de cédula

  Verificación de edad (compra de alcohol, acceso a evento)
  ─────────────────────────────────────────────────────────
  El verificador solicita:  ¿mayor de 18?
  El ciudadano comparte:    sí/no (prueba criptográfica)
  El verificador NO ve:     nombre, fecha de nacimiento, dirección, foto

  Banco (verificación KYC)
  ────────────────────────
  El banco solicita:    nombre + cédula + foto
  El ciudadano comparte: exactamente eso
  El banco NO ve:       historial vehicular, restricciones médicas, infracciones
```

### Cómo funciona técnicamente

La credencial contiene todos los atributos firmados individualmente por el emisor (COSEVI). Al momento de presentar, el wallet del ciudadano genera una **prueba criptográfica** que incluye solo los atributos solicitados. El verificador puede confirmar que:

1. Los atributos fueron firmados por COSEVI (autenticidad)
2. No han sido alterados (integridad)
3. La credencial no ha sido revocada (vigencia)

Sin acceder a ningún dato adicional. Sin llamar a ningún servidor de COSEVI.

---

## 2. Protección de Datos Sensibles

### Datos biométricos — Nunca salen de COSEVI

La foto y cualquier dato biométrico del ciudadano se almacenan **exclusivamente en los sistemas de COSEVI**. No viajan al blockchain, no se almacenan en los servidores del proveedor, no se incluyen en la credencial verificable.

```
  Dónde vive cada dato
  ─────────────────────
  Foto del ciudadano        → COSEVI (sistema interno)
  Firma manuscrita          → COSEVI (sistema interno)
  Huella digital            → COSEVI (sistema interno, si aplica)

  Qué contiene la credencial verificable (mDL)
  ─────────────────────────────────────────────
  Nombre, categoría, vigencia, restricciones
  Hash de la foto (para verificación opcional — no la foto misma)
  Firma criptográfica de COSEVI
  DID del titular

  Qué se ancla en blockchain
  ──────────────────────────
  Hash de integridad de la credencial (no datos personales)
  Timestamp de emisión
  Estado de revocación
```

Un hash sin la preimagen no es dato personal bajo la Ley 8968. El blockchain no contiene ningún dato que permita identificar al ciudadano.

### El dictamen médico — Solo apto o no apto

El consultorio autorizado emite una credencial de aptitud médica que contiene **únicamente el resultado funcional**:

```
  Lo que contiene la credencial médica
  ─────────────────────────────────────
  • Resultado: apto / no apto / apto con restricciones
  • Tipo de restricción (si aplica): lentes, audífono, adaptación vehicular
  • Fecha de emisión
  • Fecha de vencimiento
  • Firma del consultorio autorizado

  Lo que NO contiene
  ──────────────────
  • Diagnóstico médico
  • Historial clínico
  • Medicamentos
  • Resultados de exámenes
  • Cualquier dato de salud
```

COSEVI verifica que el ciudadano tiene un dictamen vigente con resultado "apto" — no necesita saber por qué es apto. El diagnóstico queda entre el ciudadano y su médico.

---

## 3. Verificación Sin Exposición — Qué Ve Cada Actor

| Actor | Qué ve | Qué NO ve |
|---|---|---|
| **Oficial de tránsito** | Licencia válida, categoría, restricciones, SOAT, RTV, marchamo | Dirección, cédula, historial médico, infracciones pagadas |
| **Rent-a-car** | Nombre, categoría, vigencia | Dirección, cédula, restricciones médicas, infracciones |
| **Aseguradora** | Licencia válida, categoría, cobertura vigente | Historial completo, datos médicos |
| **Empleador** | Licencia válida, categoría (si el puesto lo requiere) | Todo lo demás |
| **COSEVI** | Registro completo (es el emisor) | — |
| **Oficial en Panamá** | Licencia válida, categoría, foto (ISO 18013-5) | Sistema interno de CR |

La verificación es **local y criptográfica**:

- El verificador no necesita conexión a internet
- No llama a servidores de COSEVI ni de ninguna institución
- Verifica la firma matemáticamente en el dispositivo
- Funciona en zonas rurales sin conectividad
- Funciona en el extranjero sin infraestructura costarricense

### Qué pasa cuando el verificador pide más de lo necesario

El wallet del ciudadano puede **rechazar** atributos que no corresponden al contexto. Si un rent-a-car solicita el historial de infracciones, el ciudadano ve la solicitud y decide si la acepta o no. El estándar ISO 18013-5 requiere que el ciudadano autorice cada presentación — no es automática.

---

## 4. Derecho al Olvido y Minimización de Datos

### Ley 8968, Art. 5 — Minimización

La arquitectura implementa minimización **por diseño**, no por política:

- Cada credencial contiene solo los atributos necesarios para su propósito
- Cada presentación expone solo los atributos solicitados
- Cada verificación es efímera — el verificador no retiene datos después de confirmar

### Ley 8968, Art. 6 — Derecho de cancelación

Si un ciudadano ejerce su derecho al olvido:

```
  1. COSEVI elimina los datos personales de su sistema
  2. La credencial en el wallet del ciudadano se revoca
  3. El hash en blockchain queda huérfano — sin la preimagen, es un número sin significado
  4. Ningún verificador puede reconstruir datos del ciudadano desde el hash

  Resultado: eliminación efectiva y verificable
```

### Ley 8968, Art. 7 — Consentimiento

El ciudadano consiente cada presentación individualmente. No hay recolección pasiva de datos. No hay tracking. No hay perfilamiento. El wallet no transmite nada sin autorización explícita del titular.

### Ley 8968, Art. 9 — Datos sensibles

Los datos de salud (dictamen médico) se tratan con protección reforzada:
- El diagnóstico nunca sale del consultorio
- La credencial solo contiene el resultado funcional
- COSEVI no almacena datos médicos — solo verifica que existe un dictamen vigente

---

## 5. Marco Legal Aplicable

| Norma | Artículo | Relevancia para privacidad |
|---|---|---|
| **Ley 8968** (Protección de Datos) | Art. 5 — Minimización | Divulgación selectiva por diseño en cada presentación |
| **Ley 8968** | Art. 6 — Derecho de cancelación | Hash sin preimagen no es dato personal — eliminación efectiva |
| **Ley 8968** | Art. 7 — Consentimiento | Cada presentación requiere autorización del titular |
| **Ley 8968** | Art. 9 — Datos sensibles | Biometría en COSEVI, dictamen solo apto/no apto |
| **Ley 8454** (Firma Digital) | Art. 3 | Firma criptográfica del emisor — equivalencia funcional |
| **ISO 18013-5** | Sec. 8.2, 9 | QR engagement + divulgación selectiva estándar |
| **CNTD** | Cap. 2 | Autodeterminación informativa — el ciudadano porta y controla sus credenciales |
| **CNTD** | Cap. 6 | Neutralidad tecnológica — estándares W3C, ISO, IETF |

---

## 6. Resumen

```
  Privacidad del ciudadano
  ────────────────────────
  ✓ Divulgación selectiva — muestra solo lo necesario en cada contexto
  ✓ Biometría protegida — nunca sale de COSEVI
  ✓ Dictamen médico — solo apto/no apto, sin diagnóstico
  ✓ Verificación local — sin servidores, sin tracking, sin perfilamiento
  ✓ Derecho al olvido — compatible por diseño (hash sin preimagen ≠ dato personal)
  ✓ Consentimiento — cada presentación requiere autorización explícita

  Lo que NO está en la credencial ni en blockchain
  ─────────────────────────────────────────────────
  ✗ Foto del ciudadano
  ✗ Diagnóstico médico
  ✗ Dirección domiciliar
  ✗ Historial de infracciones
  ✗ Datos financieros
  ✗ Ningún dato que permita identificar al ciudadano sin su consentimiento
```

La privacidad no es una capa que se agrega después. Es una propiedad estructural de la arquitectura — el ciudadano tiene más control sobre sus datos con una credencial verificable que con una tarjeta de plástico.

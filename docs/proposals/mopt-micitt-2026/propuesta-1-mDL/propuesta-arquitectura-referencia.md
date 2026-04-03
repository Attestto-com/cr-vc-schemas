# Propuesta de Arquitectura de Referencia

## Infraestructura Digital para la Transformación de Licencias de Conducir y Ecosistema Vial de Costa Rica

**Dirigido a:**
Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones (MICITT)
Ministerio de Obras Públicas y Transportes (MOPT)
Asesoría Tecnológica Institucional COSEVI
Dirección de Gobernanza Digital y Centro de Facilitación de Datos (DGDCFD)

**Presentado por:** Attestto Open — attestto.org
**Fecha:** Abril 2026
**Naturaleza:** Contribución técnica de código abierto. Los componentes de referencia están publicados en GitHub y cualquier oferente puede adoptarlos, incluyendo Attestto. Este documento es de libre uso, citación y distribución.

---

> **Nota Aclaratoria — Naturaleza del Documento**
>
> Este documento es una **arquitectura de referencia abierta**, no una oferta de adjudicación. Attestto Open no cumple con los requisitos de experiencia establecidos en el pliego de condiciones — entre ellos la emisión de más de 450,000 licencias por año y la gestión de más de 50,000 documentos de seguridad por año — y está **técnicamente descalificado para participar como oferente** en la licitación 2026LY-000001-0012400001.
>
> El propósito de esta contribución es exclusivamente **definir el estándar abierto** que cualquier oferente adjudicatario pueda adoptar, garantizando interoperabilidad, portabilidad y no dependencia de proveedor — alineado con las observaciones del MICITT (MICITT-DGDCFD-OF-198-2025).
>
> Attestto Open es la única voz objetiva en este proceso porque **no puede ganar el contrato**.

---

## Presentación

Este documento presenta una **arquitectura de referencia abierta** para la infraestructura digital del ecosistema vial costarricense, elaborada en respuesta a la licitación 2026LY-000001-0012400001 (COSEVI/MOPT) y a las observaciones técnicas formuladas por el MICITT (MICITT-DGDCFD-OF-198-2025).

No es una propuesta de adjudicación. Es una contribución técnica al proceso, presentada como código abierto y bien público, que cualquier institución, empresa oferente o ciudadano puede adoptar, auditar o extender libremente.

---

## 1. El Problema Real: No es Tecnológico, es de Usabilidad

La licitación actual define con precisión qué digitalizar — la licencia de conducir, la prueba teórica, la emisión física. Pero no responde la pregunta más importante: **¿qué experiencia tendrá el ciudadano cuando todo esto esté implementado?**

Si la respuesta honesta es "básicamente la misma que hoy, pero con una app más", el proyecto habrá fallado independientemente de la tecnología utilizada.

Esta propuesta parte de los problemas reales del ciudadano costarricense y deriva la arquitectura como consecuencia. No al revés.

### 1.1 Los Problemas del Ciudadano Hoy

**El viaje innecesario.** Un conductor de Nicoya necesita renovar su licencia. Las citas en la sede más cercana tienen semanas de espera. Va a Liberia. Le dicen que le falta el dictamen médico. Vuelve otro día. La renovación que debería tomar 20 minutos tomó dos días y 200 kilómetros. Esto no es un problema de digitalización — es un problema de que los sistemas no coordinan para el ciudadano.

**El documento que no viaja.** Ese mismo conductor viaja a Panamá. Su licencia costarricense en papel funciona porque el Convenio de Viena sobre Circulación Vial lo garantiza. Pero si Costa Rica emite una licencia digital en una app propietaria, esa app no existe en Panamá, no la puede leer la policía panameña, y el ciudadano tiene que llevar la tarjeta de plástico de todas formas. La digitalización no le sirvió para nada en ese contexto.

**Los datos que no cruzan instituciones.** Para renovar, el ciudadano debe demostrar que no tiene multas (COSEVI), que pagó el marchamo (Hacienda), que tiene el dictamen médico (consultorio privado), que el seguro está vigente (INS). Cada una de esas verificaciones requiere una gestión separada porque los sistemas no hablan entre sí. El ciudadano actúa como mensajero físico entre instituciones que deberían coordinarse automáticamente.

**El sistema diseñado para sí mismo, no para la persona.** Hoy existen en Costa Rica múltiples apps de identidad digital — la IDC del TSE, apps de la CCSS, plataformas del MOPT — cada una diseñada para los procesos internos de su institución, no para el ciudadano que debe usarlas todas. Ninguna se habla con las demás. El ciudadano instala cuatro apps para resolver problemas que deberían resolverse con una.

### 1.2 La Pregunta Correcta para Esta Licitación

No es: _¿cómo digitalizamos la licencia de conducir?_

Es: **¿cómo hacemos que los documentos del ciudadano funcionen — en cualquier institución pública o privada, en cualquier país, en el dispositivo que ya tiene, sin depender de que todos los actores hayan contratado al mismo proveedor?**

Esa pregunta tiene una respuesta técnica clara: **portabilidad e interoperabilidad basadas en estándares abiertos internacionales**. Todo lo demás — la arquitectura, los protocolos, el blockchain, la soberanía de datos — son los medios para ese fin, no el fin en sí mismo.

### 1.3 Lo que Ocurre si Esta Licitación No Resuelve el Problema Correcto

Si la mDL se implementa sobre una arquitectura propietaria de un solo proveedor — lo que el artículo 5.9 del pliego actual permite y hasta incentiva — el ciudadano costarricense tendrá en 2027:

* Una app para la licencia de conducir que no habla con la app de identidad del TSE (IDC)
* Una app de identidad del TSE que no habla con el MOPT ni con el INS
* Una app del INS para el SOAT que no habla con las anteriores
* Y el oficial de tránsito con tres apps en el teléfono para verificar lo que debería ser una sola presentación

No es una hipótesis. Es el patrón que ya se repitió con CCSS (EDUS), TSE (IDC), COSEVI (SGLC) y decenas de sistemas municipales. Cada uno técnicamente correcto. Ninguno interoperable con los demás.

---

## 2. La Solución: Portabilidad Real para el Ciudadano

### 2.1 El Principio Fundamental

El ciudadano porta sus propias credenciales en su dispositivo. Las instituciones las emiten. Cualquier verificador — en Costa Rica o en el exterior — puede verificarlas directamente, sin llamar a ningún sistema central, sin requerir que el verificador y el emisor sean del mismo proveedor.

Esto no es una propuesta nueva. Es exactamente el modelo que **Apple Wallet y Google Wallet ya implementan para licencias de conducir** en los estados de EEUU que han adoptado ISO 18013-5 como estándar. Un oficial de tránsito en Arizona puede verificar una licencia digital de Maryland con su iPhone sin saber nada del sistema de Maryland. Eso es interoperabilidad real.

### 2.2 La Diferencia con lo que Existe Hoy

| Situación actual | Con arquitectura SSI y estándares abiertos |
|---|---|
| El ciudadano es mensajero entre instituciones | Las instituciones emiten credenciales al wallet del ciudadano |
| Cada institución tiene su app | El ciudadano elige su wallet — Apple, Google, o cualquier compatible |
| La licencia digital funciona solo en CR | La licencia es verificable en cualquier país que implemente ISO 18013-5 |
| Renovar requiere visita presencial | Renovar desde el teléfono en segundos cuando los prerequisitos están en el wallet |
| El oficial consulta 4 sistemas | El oficial escanea una sola presentación — licencia, seguro, RTV, marchamo |
| Cambiar de proveedor = rehacerlo todo | Cambiar de proveedor = instalar el SDK estándar |
| La tarjeta física es obligatoria | La tarjeta física es opcional — para quien la necesite |

### 2.3 La Portabilidad en Tres Dimensiones

**Portabilidad interinstitucional (público y privado):**
La credencial emitida por COSEVI puede ser verificada por un banco, una aseguradora, un empleador, o una municipalidad — sin acuerdos bilaterales, sin APIs especiales, sin que el banco tenga que llamar al COSEVI. Cada institución emite lo que le corresponde; el ciudadano decide con quién lo comparte.

**Portabilidad internacional (bidireccional):**
Una licencia emitida bajo ISO 18013-5 con el QR engagement profile estándar es verificable por cualquier sistema compatible en el mundo. Y la interoperabilidad funciona en ambas direcciones: del mismo modo que un conductor costarricense presenta su mDL en Panamá, **un conductor panameño, europeo o estadounidense que llegue a Costa Rica podría presentar su licencia digital al oficial costarricense**, quien la verifica con el mismo SDK estándar.

**Portabilidad entre proveedores:**
Si el proveedor que implementa el sistema cierra, cambia sus condiciones, o el contrato vence, las credenciales del ciudadano siguen siendo válidas en cualquier wallet. El Estado puede cambiar de proveedor sin pedirle al ciudadano que reinstale nada. Eso es lo opuesto del vendor lock-in.

### 2.4 El Documento Físico: Opcional Desde el Día 1

La tarjeta de plástico existe hoy por una razón específica: verificación en contextos donde no hay infraestructura digital — un control de tránsito rural sin conectividad, un cruce fronterizo con un país que no ha adoptado mDL, un oficial sin app verificadora.

Fuera de esos contextos, la tarjeta de plástico es:

* Un costo innecesario (~$3–5 por tarjeta según benchmarks LATAM para material PETG banking-grade; $1.5–2.5M anuales a escala)
* Un punto de falla (se pierde, se deteriora, se falsifica)
* Un requisito que obliga al ciudadano a ir a una sede cuando no necesitaría hacerlo

La arquitectura correcta desacopla la emisión digital de la emisión física **desde el día 1**. Digital por defecto, físico por elección.

### 2.5 La Ventaja Criptográfica: Verificabilidad que el Plástico No Puede Ofrecer

**El problema del documento físico:**

* **Se pierde o se lo roban.** Mientras se reporta y se reemite, existe un periodo de vulnerabilidad donde el documento robado sigue pareciendo válido ante inspección visual.
* **Se falsifica.** Los elementos de seguridad físicos dificultan la falsificación, pero no la eliminan — y ningún oficial en un control rutinario tiene un laboratorio para verificarlos.
* **No prueba presencia.** Cualquier persona que porte la tarjeta puede presentarla.
* **La reemisión toma días o semanas.**

**Lo que una credencial verificable resuelve:**

* **Vinculación criptográfica al titular.** La credencial está ligada a una clave en el dispositivo. Quien robe el teléfono no puede presentar la credencial sin la autenticación biométrica del dispositivo.
* **Revocación instantánea.** El momento en que el ciudadano reporta el dispositivo como perdido, la credencial se revoca. Cualquier verificación posterior falla inmediatamente.
* **Prueba de presencia.** La presentación incluye un desafío criptográfico que solo puede resolver el dispositivo del titular en ese momento.
* **Reemisión en segundos.** Nuevo dispositivo, autenticación, credenciales reemitidas. Sin sede, sin duplicado, sin espera.

_(Ver sub-página: Privacidad en el Ecosistema de Credenciales Verificables — para el detalle de divulgación selectiva, protección de datos sensibles y marco legal.)_

---

## 3. Por Qué los Monolitos y los Silos Son el Problema Central

### 3.1 El Costo del Vendor Lock-in

Cuando el Estado contrata un sistema propietario de identidad digital, no solo está comprando software. Está transfiriendo control:

* **Control sobre los protocolos:** si el QR que genera el sistema no sigue el estándar ISO 18013-5 sección 8.2 — como ocurre, según nuestro análisis, con la IDC del TSE, cuyo QR no puede ser parseado por SDKs públicos disponibles — ningún actor externo puede integrarse sin contratar al mismo proveedor.
* **Control sobre la UX:** el ciudadano queda atado a la experiencia de usuario que el proveedor decide ofrecer, sin competencia ni alternativa.
* **Control sobre el futuro:** cuando el contrato vence, el Estado no tiene el código, no tiene los esquemas, no tiene los scripts de migración. Empieza de cero o renueva en condiciones desfavorables.

### 3.2 La IDC como Caso Ilustrativo

La IDC del TSE declara compatibilidad con ISO 18013-5. Sin embargo, según nuestro análisis técnico, el QR que genera no sigue el `DeviceEngagement` CBOR profile definido en la sección 8.2 del estándar — el formato que cualquier SDK público puede leer. Utiliza un formato propietario que SDKs públicos independientes no pueden parsear.

El resultado es que la IDC es interoperable en teoría y un silo en la práctica. Si la mDL sigue el mismo patrón, Costa Rica tendrá dos silos de identidad que no se hablan entre sí.

**La solución no es técnica — es contractual:** exigir que la conformidad con el estándar sea demostrable con SDKs públicos de terceros como condición de aceptación.

### 3.3 La UX como Requisito de Primer Nivel

La licitación actual define SLAs de disponibilidad y latencia, pero no define nada sobre la experiencia del ciudadano. Eso es un error estructural.

La arquitectura resuelve la UX desde el diseño:

* El ciudadano no necesita coordinar entre instituciones — el wallet lo hace por él
* El sistema notifica proactivamente qué falta antes de que el ciudadano lo descubra en la sede
* La renovación digital no requiere visita presencial si los prerequisitos están en el wallet
* El verificador no necesita apps múltiples — una presentación contiene todo

### 3.4 Lo que el Estudio de Mercado y el Análisis de Rentabilidad Revelan

Los documentos del expediente confirman que los oferentes están respondiendo lógicamente a la estructura de incentivos del pliego. La preocupación no es con los oferentes, sino con la estructura del pliego misma.

#### La estructura tarifaria incentiva el monolito

El Análisis de Rentabilidad (Anexo 7, Sección IV) establece una **tarifa integrada de ₡13,000** que incluye el documento físico (₡10,000) y la activación de la licencia digital (₡3,000) como cobro conjunto. No existe una opción de emisión digital independiente.

El propio documento describe esta integración obligatoria como "un catalizador de eficiencia financiera" — la mDL subsidia la infraestructura PKI del proveedor. La licencia digital no fue diseñada como un servicio al ciudadano, sino como un mecanismo para hacer viable el modelo financiero del proveedor.

**La consecuencia directa:** el modelo financiero castiga las renovaciones digitales puras. Si un ciudadano pudiera renovar digitalmente por ₡500–1,000 (el costo real de emitir una credencial verificable), el proveedor perdería ₡10,000–12,000 por transacción. La estructura tarifaria crea un incentivo estructural para mantener la tarjeta física como obligatoria.

#### Los oferentes responden racionalmente

El Estudio de Mercado (Anexo 8, Sección 4) muestra que los tres oferentes consultados — GET Group, SERTRACEN y Banco de Costa Rica — proponen arquitecturas coherentes con estos incentivos:

* **Cada oferente propone su propia app de wallet propietaria.** Ninguno ofrece exportación de credenciales a Apple Wallet, Google Wallet, o cualquier wallet de terceros.
* **La emisión digital está acoplada a la emisión física.** No existe un flujo de renovación digital independiente.
* **No hay SDK de integración para terceros.** Ningún oferente propone que otras instituciones puedan emitir o verificar credenciales a través del mismo sistema.

#### La escala financiera del lock-in

| Concepto | Valor |
|---|---|
| Ingresos brutos 10 años | ₡85,963M (~$165M USD) |
| Trámites de licencia (10 años) | 5,676,303 |
| Pruebas teóricas (10 años) | 2,434,383 |
| CAPEX estimado (referencia RACSA) | US$3,101,674 |
| OPEX 4 años (referencia RACSA) | US$25,669,739 |

$165 millones USD en 10 años canalizados a un solo proveedor, con código propietario (Art. 5.9), wallet propietaria, y formato de QR potencialmente no estándar.

#### El costo real de una credencial digital

| Componente | Costo |
|---|---|
| Firma criptográfica (Ed25519) | ~0 (operación local, <1ms) |
| Anclaje blockchain (Solana, lotes Merkle) | ~$0.0005 por credencial |
| Anclaje blockchain (individual, SAS) | ~$0.50 por attestation |
| Entrega al wallet del ciudadano | ~0 (push notification) |
| **Total marginal por credencial (con lotes)** | **<$0.01** |

_Nota: Medición realizada el 3 de abril de 2026 desplegando la infraestructura real del ecosistema vial en Solana Devnet via el Solana Attestation Service (SAS)._

Incluyendo infraestructura, PKI, mantenimiento y soporte, una emisión digital independiente podría ofrecerse en el rango de **₡500–1,000 (~$1–2 USD)** — no ₡13,000.

#### Lo que cambia para el ciudadano

**Bajo el pliego actual (₡13,000 tarifa integrada):**

* Pedir cita, desplazarse a la sede, esperar en fila
* Pagar ₡13,000 — incluye la tarjeta física aunque no la necesite
* Recibir una mDL en la app propietaria del proveedor — no exportable, no interoperable
* Si viaja a Panamá, llevar la tarjeta plástica de todas formas

**Bajo la arquitectura abierta (₡500–1,000 emisión digital):**

* Notificación en el teléfono: "Tu licencia vence en 30 días. Todos los prerequisitos están en orden."
* Toque "Renovar" → nueva mDL en el wallet en segundos
* Desde la casa, a cualquier hora, cualquier día
* Si necesita la tarjeta física, la solicita por separado como servicio opcional
* En un control de tránsito: el oficial escanea un QR y verifica licencia + SOAT + RTV + marchamo en una sola presentación, sin conectividad
* En Panamá: el mismo QR, el mismo estándar, sin convenio bilateral

#### Lo que cambia para el oficial de tránsito

El pliego actual resuelve la verificación de la licencia, pero no aborda cómo el oficial verifica SOAT, RTV, marchamo, o propiedad vehicular. La mDL se convierte en un sistema más, no en una plataforma de integración.

Con la arquitectura abierta, cualquier aplicación existente que el oficial ya utilice puede integrar el SDK (`cr-vc-sdk`) y verificar todos los tipos de credencial del ecosistema — mDL, SOAT, RTV, marchamo, propiedad vehicular — a través de una sola integración. La verificación es una operación criptográfica local: funciona sin conectividad.

#### La prueba práctica como credencial verificable

El resultado de la prueba práctica se convierte en una credencial verificable emitida una sola vez por categoría de licencia:

**Opción A (día uno):** COSEVI/DGEV emite un `DrivingTestResult` VC desde su sistema existente cuando el conductor aprueba. No requiere cambios en las escuelas de manejo.

**Opción B (evolución futura):** La escuela de manejo o el examinador certificado integra el SDK y emite el VC directamente al wallet del conductor.

En ambos casos, el VC es un prerequisito permanente para la emisión de la mDL en esa categoría.

---

## 4. La Arquitectura Como Consecuencia

Dados los problemas del ciudadano y los objetivos de portabilidad real, la arquitectura tiene las siguientes características necesarias:

**Estándares abiertos con conformidad verificable.** No basta declarar compatibilidad. La conformidad debe ser demostrable con SDKs de terceros independientes del proveedor (Spruce ID, Google Identity Credential API, Apple Wallet). Si el QR de la mDL no funciona con esos SDKs, no es compatible con el estándar.

**Wallet soberana del ciudadano.** Las credenciales viven en el dispositivo del ciudadano, no en los servidores del proveedor. El ciudadano puede presentar sus credenciales a cualquier verificador compatible sin permiso del emisor original.

**Emisión instantánea con resolver público.** Cuando COSEVI emite una licencia, firma la credencial, publica su DID document con el resolver, y la entrega al wallet del ciudadano. Desde ese momento, cualquier sistema puede resolver el DID del emisor, leer la VC, y verificar la firma — sin depender de ningún sistema legacy ni del proveedor original.

**Blockchain como ledger descentralizado de coordinación.** La cadena pública cumple dos funciones: primero, es el **ledger compartido que elimina las integraciones bilaterales** entre instituciones — en lugar de que COSEVI hable con INS, con RTV, con Hacienda mediante APIs punto a punto, todas las instituciones escriben y leen del mismo registro público. Segundo, proporciona integridad verificable por cualquier actor del mundo. Lo que se ancla son las pruebas criptográficas (hashes de integridad, timestamps), no las credenciales. Las credenciales son verificables antes de que el anclaje se complete. _(Ver sub-página: Arquitectura Técnica — Blockchain, Resolución de DIDs y Verificación.)_

**Infraestructura desplegada y verificable.** La infraestructura on-chain fue desplegada en Solana Devnet el 3 de abril de 2026 mediante el Solana Attestation Service (SAS). El despliegue completo — credencial, 3 esquemas, y attestations de prueba — costó **0.023 SOL (~$3.50 USD)**:

| Entidad | Tipo | Definición del esquema | PDA (verificable en Solana Explorer) |
|---|---|---|---|
| **CR-VIAL-ECOSYSTEM** | Credencial | [deploy.ts](https://github.com/Attestto-com/cr-vc-schemas/blob/main/scripts/src/deploy.ts) | [GfqJFXi...rM6u](https://explorer.solana.com/address/GfqJFXiUVBFLHk1J7nooR9Vv1AaK3J8M3Ygz3RrzrM6u?cluster=devnet) |
| **INSTITUTION** | Esquema — anclas de confianza (COSEVI, DGEV, bancos, consultorios) | [schemas.ts — INSTITUTION](https://github.com/Attestto-com/cr-vc-schemas/blob/main/scripts/src/schemas.ts#L38-L61) | [CzvQmmy...AmW](https://explorer.solana.com/address/CzvQmmyFtQg6yLr6hRJvfjAyAaA38paGcXiRTQQVHAmW?cluster=devnet) |
| **CREDENTIAL-ANCHOR** | Esquema — anclaje de hashes de VCs (3 capas: web → CDN → cadena) | [schemas.ts — CREDENTIAL](https://github.com/Attestto-com/cr-vc-schemas/blob/main/scripts/src/schemas.ts#L71-L94) | [CsvrCdC...SW5](https://explorer.solana.com/address/CsvrCdCyiE8QyV8uZF2xZ5Cj9PpfoKkdSK7dG7K9hSW5?cluster=devnet) |
| **VEHICLE-HISTORY** | Esquema — historial de vida del vehículo (matrícula, RTV, marchamo, SOAT) | [schemas.ts — VEHICLE](https://github.com/Attestto-com/cr-vc-schemas/blob/main/scripts/src/schemas.ts#L104-L127) | [6Gn5M2q...jzJZ](https://explorer.solana.com/address/6Gn5M2q3BezbqaWQdrrh1w3xuizaJjgmdhwRpNnWjzJZ?cluster=devnet) |

_Código fuente y definiciones de esquemas: [github.com/Attestto-com/cr-vc-schemas/scripts](https://github.com/Attestto-com/cr-vc-schemas/tree/main/scripts/src)_

**Gobernanza on-chain multi-institucional.** En Mainnet, la autoridad será un **multisig multi-institucional** via Squads Protocol v4 con firmantes de COSEVI/MOPT, MICITT, y el desarrollador. Threshold 2-of-3: ninguna parte puede unilateralmente agregar o remover anclas de confianza, pausar esquemas, o revocar attestations.

**Infraestructura core como bien público.** La PKI del COSEVI, el directorio de emisores autorizados, los esquemas de credenciales — estos componentes no pueden ser propiedad de ningún proveedor. Son la infraestructura sobre la que compiten los servicios.

**Emisión física desacoplada de la emisión digital.** La tarjeta de plástico es un servicio opcional, no un prerequisito.

---

## 5. El Ecosistema Resultante

Cuando estos principios se implementan, el ecosistema vial costarricense funciona así:

```
COSEVI emite la mDL → llega al wallet del ciudadano en segundos
Consultorio emite el dictamen médico → llega al wallet automáticamente
INS emite la póliza SOAT → llega al wallet automáticamente
RTV emite la revisión técnica → llega al wallet automáticamente
INS emite los derechos de circulación (marchamo) → llega al wallet automáticamente

El ciudadano que renueva desde el teléfono:
  → El sistema verifica todos los prerequisitos del wallet criptográficamente
  → Sin llamar a ninguna institución
  → Sin cita, sin sede, sin espera
  → Nueva mDL en el wallet en segundos

El oficial de tránsito en un control:
  → Escanea un QR del teléfono del conductor
  → Recibe: licencia válida + categoría + SOAT vigente + RTV vigente + marchamo
  → Todo en una sola presentación
  → Sin conectividad requerida (verifica la firma localmente)

El conductor costarricense en Panamá:
  → Muestra el QR de su mDL
  → El oficial panameño lo escanea con su app ISO 18013-5
  → Verificación exitosa — mismos estándares, sin convenio bilateral

El conductor panameño en Costa Rica:
  → Muestra su mDL emitida en Panamá
  → El oficial costarricense la verifica con el mismo SDK
  → Sin app adicional, sin convenio especial
```

Esto no requiere que todos los actores estén en el mismo proveedor. Requiere que todos hablen el mismo estándar.

---

## 6. Las Instituciones del Ecosistema Como Emisores

| Institución | Credencial que emite | El ciudadano la usa para |
|---|---|---|
| COSEVI | Licencia de conducir digital (mDL) | Identificarse ante cualquier verificador en CR y el exterior |
| DGEV / proveedor certificado | Resultado de prueba teórica | Prerequisito para emitir la mDL |
| Escuela de manejo / COSEVI | Resultado de prueba práctica | Prerequisito permanente por categoría de licencia |
| Consultorio autorizado | Aptitud médica (solo apto/no apto) | Prerequisito para renovar, sin revelar diagnóstico |
| INS | Póliza SOAT vigente | Demostrar cobertura ante oficiales, MOPT, bancos |
| RTV | Revisión técnica vehicular | Demostrar cumplimiento reglamentario |
| INS | Derechos de circulación (marchamo) | Demostrar pago sin necesitar la calcomanía física |
| Registro Nacional | Propiedad vehicular | Demostrar titularidad ante compradores, bancos, notarios |
| TSE | Identidad ciudadana | Base de toda la cadena de confianza |
| Bancos | Verificación KYC | Ancla de confianza para firma digital (Ley 8454 Art. 3) |

---

## 7. Respuesta a las Observaciones del MICITT

El oficio MICITT-DGDCFD-OF-198-2025 / MICITT-DC-OF-578-2025, suscrito el 24 de octubre de 2025, emitió siete observaciones. Se citan textualmente con respuesta arquitectónica.

---

### Observación 1 — Neutralidad tecnológica

> _"Para no restringir oferentes, se recomienda declarar equivalencias explícitas y centrar la exigencia en resultados funcionales (interoperabilidad, seguridad, portabilidad y verificación) antes que en marcas/implementaciones particulares."_
> — MICITT-DGDCFD-OF-198-2025, Observación 1

**Respuesta:** Esta arquitectura está construida sobre resultados funcionales. La exigencia correcta no es "implementar ISO 18013-5" — es "demostrar que el QR generado puede ser parseado por SDKs públicos de terceros como Google Identity Credential API y Spruce ID". La IDC del TSE es el contraejemplo exacto: declara compatibilidad con el estándar pero genera un QR que SDKs públicos independientes no pueden leer.

---

### Observación 2 — KPIs/SLA y método de verificación

> _"El pliego debe vincularlos a una rúbrica formal con método de medición, fuentes de datos, criterios de aceptación y régimen de penalidades/bonos, incluyendo métricas operativas."_
> — MICITT-DGDCFD-OF-198-2025, Observación 2

**Respuesta:** En una arquitectura SSI, la verificación de credenciales opera sin servidor central — no genera carga, no tiene latencia de red, no puede caer. Los SLA críticos se concentran en el motor de emisión (al momento de la cita) y el anclaje blockchain. El anclaje opera de forma asíncrona y no bloquea la emisión. La arquitectura reduce drásticamente la superficie sujeta a SLA.

---

### Observación 3 — Capacidad y pruebas de carga

> _"Las metas de concurrencia y latencia deben atarse a una matriz de dimensionamiento y a pruebas de carga/estrés previas a producción, con aceptación por percentiles (p95/p99)."_
> — MICITT-DGDCFD-OF-198-2025, Observación 3

**Respuesta:** La verificación de credenciales es una operación criptográfica local — cero carga de servidor. El único componente con pico de carga es el motor de emisión: 523,000 emisiones/año en horario de atención (Anexo 7, p.9), un evento predecible y dimensionable. El anclaje blockchain opera en lotes asíncronos mediante árboles de Merkle.

**Costo medido del anclaje blockchain** (despliegue real en Solana Devnet, 3 de abril de 2026):

| Escenario | Costo por credencial | Costo anual (740K credenciales) |
|---|---|---|
| Attestation individual SAS (medición real) | ~$0.50 | ~$370,000 |
| Lotes Merkle (1,000 credenciales/lote) | ~$0.0005 | ~$370 |
| Fee base Solana (transacción simple) | $0.00025 | $185 |

Esto se compara con un costo estimado de $1M–2.3M en desarrollo de integraciones bilaterales punto a punto entre las 5 instituciones requeridas en el pliego.

---

### Observación 4 — Privacidad y biometría

> _"Reforzar el PIA con matriz de riesgos por tipo de dato (rostro, voz, telemetría), reglas de minimización y retención, segregación lógica por roles/entornos y eliminación verificable."_
> — MICITT-DGDCFD-OF-198-2025, Observación 4

**Respuesta:** Biometría almacenada exclusivamente en COSEVI — nunca en el sistema del proveedor, nunca en blockchain. El dictamen médico contiene solo el resultado funcional (apto/no apto) — el diagnóstico no entra al ecosistema. El derecho al olvido es compatible: eliminar el dato de COSEVI deja el hash en blockchain inútil. Un hash sin preimagen no es dato personal bajo Ley 8968. _(Ver sub-página: Privacidad en el Ecosistema de Credenciales Verificables.)_

---

### Observación 5 — Integridad documental proporcional

> _"La integridad del expediente puede garantizarse con firmas, hashing, WORM y sellado de tiempo. Si se mantiene blockchain como opción, que sea opcional/valorable sujeto a análisis de costo-beneficio."_
> — MICITT-DGDCFD-OF-198-2025, Observación 5

**Respuesta:** Ver tabla de costos medidos en la respuesta a la Observación 3. Con la estrategia de lotes Merkle, el costo de anclaje blockchain es de **~$370/año** para 740,000 credenciales. Las cuentas SAS individuales para las ~50 anclas de confianza institucionales representan ~$25 adicionales. El costo total de anclaje blockchain para todo el ecosistema: **menos de $400/año**. El blockchain no es base de datos — es registro de integridad que hace las credenciales verificables por cualquier sistema del mundo sin acuerdo previo.

---

### Observación 6 — Transparencia y auditoría del proctoring

> _"El módulo de supervisión debe registrar decisiones, criterios de detección, fuentes de evidencia y explainability adecuada para gestión de apelaciones, evitando cajas negras."_
> — MICITT-DGDCFD-OF-198-2025, Observación 6

**Respuesta:** Esta observación es imposible de cumplir mientras el artículo 5.9 del pliego mantenga el código como propiedad exclusiva del adjudicatario. Sin acceso al código del motor de proctoring, no hay forma de auditar los criterios de detección. La modificación propuesta en la Sección 8 es el prerequisito técnico para cumplir esta observación.

---

### Observación 7 — Reversibilidad y portabilidad de datos

> _"Exigir exportación íntegra del expediente en formatos abiertos, sin repositorios sombra, con plan de roll-back probado y entregables de migración."_
> — MICITT-DGDCFD-OF-198-2025, Observación 7

**Respuesta:** En una arquitectura SSI, la reversibilidad es estructural: las credenciales viven en el wallet del ciudadano, los hashes en blockchain público, los esquemas en repositorios abiertos. No hay repositorio sombra que migrar. Al vencer el contrato, cualquier proveedor puede operar el sistema con los mismos esquemas públicos. Esto es lo opuesto al patrón actual de la IDC.

---

## 8. Modificación Propuesta al Artículo 5.9

El artículo 5.9 del pliego establece que el software es propiedad del adjudicatario y el Estado no accede al código fuente. Esto hace estructuralmente incumplibles las Observaciones 6 y 7 del MICITT, y reproduce el patrón de la IDC.

**Cambio 1 — Auditabilidad bajo NDA:** motor de proctoring, PKI y algoritmos de detección biométrica deben ser auditables por MICITT y Contraloría bajo confidencialidad institucional.

**Cambio 2 — Esquemas y APIs como bien público:** los esquemas JSON-LD de credenciales y las especificaciones OpenAPI deben publicarse desde el inicio del contrato.

**Cambio 3 — Escrow de código fuente:** el proveedor deposita el código en custodia con el MICITT, liberado automáticamente al Estado en caso de rescisión, quiebra, o vencimiento sin renovación.

**Obligaciones contractuales durante los 10 años:**

* 1 ingeniero dedicado al repositorio, identificado nominalmente ante el MICITT
* Sincronización con producción en máximo 5 días hábiles
* Respuesta a contribuciones externas en 20 días hábiles con justificación técnica
* Incumplimiento del repositorio activa la misma cláusula penal que el incumplimiento de SLA

### ¿Qué gana el proveedor?

* **Implementación más rápida:** SDKs y esquemas públicos reducen el esfuerzo de integración con las 5+ instituciones del ecosistema.
* **Menor responsabilidad:** con esquemas y protocolos públicos auditables, la responsabilidad sobre interoperabilidad es compartida.
* **Mercado más grande:** un ecosistema abierto permite que otros actores se integren por su cuenta. Cada integración nueva aumenta el valor del sistema que el proveedor opera.
* **Continuidad contractual:** un Estado que no se siente atrapado es un Estado que renueva contratos por calidad de servicio, no por falta de alternativas.

---

## 9. Kit de Integración para el Ecosistema

### Esquemas de Credenciales (cr-vc-schemas)

| Esquema | Emisor | Para qué lo usa el ciudadano |
|---|---|---|
| [`DrivingLicense`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/mdl/DrivingLicense.schema.json) | COSEVI | Identificarse ante cualquier verificador en CR y el exterior |
| [`DrivingTestResult`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/driving-test/TheoreticalTestResult.schema.json) | DGEV / proveedor certificado | Prerequisito para emitir la mDL |
| [`DrivingPracticalResult`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/driving-test/PracticalTestResult.schema.json) | COSEVI / escuela de manejo | Prerequisito permanente por categoría de licencia |
| [`MedicalFitnessCredential`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/medical/MedicalFitnessCredential.schema.json) | Consultorio autorizado | Renovar licencia sin revelar diagnóstico médico |
| [`VehicleRegistration`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/vehicle/VehicleRegistration.schema.json) | Registro Nacional | Demostrar propiedad ante compradores, bancos, notarios |
| [`VehicleTechnicalReview`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/vehicle/VehicleTechnicalReview.schema.json) | RTV | Demostrar cumplimiento ante oficiales y MOPT |
| [`CirculationRights`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/vehicle/CirculationRights.schema.json) | INS | Demostrar pago del marchamo sin necesitar la calcomanía física |
| [`SOATCredential`](https://github.com/Attestto-com/cr-vc-schemas/blob/main/schemas/insurance/SOATCredential.schema.json) | INS | Demostrar cobertura ante oficiales y verificadores |

### SDKs de Integración

| Plataforma | Paquete |
|---|---|
| Node.js / TypeScript | `@attestto-open/cr-vc-sdk` (npm) |
| .NET / ASP.NET | `Attestto.Open.CRVC` (NuGet) |
| Python | `attestto-open-crvc` (PyPI) |
| Java / Spring Boot | `org.attestto.open:cr-vc-sdk` (Maven) |

Una institución se integra en 6 pasos: registro como emisor autorizado → instalación del SDK → mapeo de datos al esquema → pruebas en Solana Devnet → certificación técnica → producción.

---

## 10. Cumplimiento Normativo

| Marco | Artículo | Lo que exige | Cómo lo resuelve esta arquitectura |
|---|---|---|---|
| **Ley 8968** | Art. 5 | Limitación de propósito | Cada credencial declara su propósito. El ciudadano presenta solo lo necesario. |
| **Ley 8968** | Art. 6 | Derecho de cancelación | Eliminar el dato de COSEVI deja el hash en blockchain inútil. Compatible. |
| **Ley 8968** | Art. 9 | Datos sensibles | Biometría solo en COSEVI. Resultado médico sin diagnóstico. |
| **Ley 8454** | Art. 3 | Equivalencia funcional | Firma anclada a DID de institución regulada. Validez legal. |
| **Ley 8220** | — | Simplificación de trámites | El ciudadano no coordina entre instituciones — el wallet lo hace. |
| **Ley 10798** | — | Interoperabilidad digital | Estándares abiertos. Sin acuerdos bilaterales requeridos. |
| **CNTD** | Cap. 2 | Autodeterminación informativa | El ciudadano porta y controla sus propias credenciales. |
| **CNTD** | Cap. 6 | Neutralidad tecnológica | Estándares W3C, ISO, IETF. Conformidad verificable con SDKs públicos. |
| **ISO 18013-5** | Sec. 8.2 | QR engagement interoperable | Implementación verificable con SDKs de terceros. |

---

## 11. Gobernanza

La infraestructura core (PKI, directorio de DIDs, esquemas, blockchain) debe gobernarse como bien público nacional. Ningún proveedor puede controlarla unilateralmente — es la base sobre la que cualquier proveedor puede competir en servicios. Las claves PKI se custodian colectivamente. Los esquemas de credenciales se proponen y aprueban en proceso abierto con participación del MICITT, COSEVI y la comunidad técnica.

La gobernanza on-chain se gestiona mediante un multisig multi-institucional con firmantes de COSEVI/MOPT, MICITT y el desarrollador. El modelo ya fue probado en Devnet y está diseñado para escalar a Mainnet mediante Squads Protocol v4.

---

## Contacto

* **Web:** attestto.org
* **GitHub:** github.com/Attestto-com
* **Email:** open@attestto.com

---

_Documento de libre uso público. No requiere atribución para ser citado, distribuido o adaptado. Abril 2026_

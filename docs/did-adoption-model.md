# Modelo de Adopcion Progresiva de DIDs Institucionales

## El Problema

Para que una institucion emita Credenciales Verificables, necesita un **Identificador Descentralizado (DID)** que la identifique como emisor confiable. El metodo `did:web` vincula el DID al dominio web de la institucion — por ejemplo, `did:web:tse.go.cr` significaria que el TSE hospeda su documento DID en `https://tse.go.cr/.well-known/did.json`.

### Por que `did:web` con dominio propio es la opcion mas confiable

- La institucion controla directamente sus claves criptograficas
- El dominio `.go.cr` ya tiene confianza publica establecida
- No depende de ningun tercero para resolver su identidad
- Es el modelo recomendado por W3C para organizaciones con dominio propio

### Por que en la practica no es viable para la mayoria de instituciones CR hoy

La operacion de un `did:web` propio requiere:

| Requisito | Realidad en instituciones CR |
|---|---|
| Certificado SSL siempre vigente | Sitios `.go.cr` frecuentemente presentan certificados expirados |
| Endpoint `/.well-known/did.json` con 99.9% uptime | Los sitios institucionales tienen caidas frecuentes por mantenimiento |
| Rotacion periodica de claves criptograficas | No existe proceso estandarizado para esto en el Estado |
| Personal tecnico dedicado a mantener el endpoint | Los equipos de TI institucionales ya estan sobrecargados |
| Licitacion para servicios de hosting/SSL | Cada cambio de proveedor puede romper el endpoint DID |

**Nota sobre la PKI nacional:** El BCCR opera la Autoridad Certificadora raiz de Costa Rica (SINPE-FD) para firma digital. Sin embargo, esta PKI esta disenada para certificados personales de firma digital (PKCS#11 en tarjeta inteligente), no para operacion de endpoints web de identidad institucional. Son infraestructuras complementarias, no sustitutas.

## La Solucion: Adopcion Progresiva en 3 Niveles

### Nivel 1: DID Delegado (inmediato, sin costo de infra)

```
did:web:cosevi.attestto.id
```

- Attestto hospeda el documento DID en el subdominio `attestto.id`
- La institucion solo necesita registrarse y entregar su clave publica
- Attestto garantiza uptime, rotacion de claves y backup
- **Cero tech debt para la institucion**
- Activacion en minutos, no en meses

**Quien lo usa:** Cualquier institucion que quiera empezar a emitir VCs inmediatamente sin licitacion de infraestructura.

### Nivel 2: DID con dominio propio (cuando la institucion este lista)

```
did:web:csv.go.cr
```

- La institucion hospeda su propio `/.well-known/did.json`
- Attestto puede asistir en la configuracion inicial
- La institucion asume la responsabilidad de mantener el endpoint
- Las VCs emitidas con el DID anterior (`did:web:cosevi.attestto.id`) siguen siendo validas
- Se puede mantener ambos DIDs en paralelo durante la transicion

**Quien lo usa:** Instituciones con equipo tecnico dedicado y contrato de hosting estable.

### Nivel 3: DID on-chain (maxima soberania)

La capa on-chain usa un **Smart Contract dedicado de registro de DIDs** en Solana (`did-registry-program`), desplegado y mantenido por Attestto Open. A diferencia de depender de Solana Name Service (SNS) — que es un registry de nombres generico no disenado para identidad — el DID registry es un programa Anchor especifico para:

- Registrar DIDs institucionales con su DID document hash y clave publica
- Anclar hashes de credenciales emitidas por cada DID
- Revocar DIDs (desactivacion on-chain)
- Todo en PDAs derivados del DID string — costo ~$0.002 por registro (solo tx fee)

```
Instrucciones del programa:
  register_did(did_string, did_document_hash, public_key)
  update_did(did_string, new_document_hash, authority)
  deactivate_did(did_string, authority)
  anchor_credential(did_string, vc_hash, timestamp)
```

**Quien lo usa:** Instituciones que quieran independencia total de cualquier proveedor, incluyendo Attestto. Tambien sirve como capa de verificacion de ultimo recurso cuando los servidores web no estan disponibles.

**Repositorio:** `Attestto-com/did-registry-program` (Apache 2.0, Anchor/Solana)

## Tres Capas de Verificacion

Cada credencial emitida en el ecosistema es verificable por tres vias independientes. Si una capa falla, las otras siguen funcionando:

```
Capa 1 (web):     did:web:csv.go.cr             ← La institucion (si su servidor funciona)
Capa 2 (CDN):     did:web:cosevi.attestto.id     ← Attestto como respaldo (siempre disponible)
Capa 3 (chain):   did-registry-program en Solana ← Hash on-chain (indestructible, sin servidor)
```

### Como funciona cada capa

| Capa | Que verifica | Cuando se usa | Disponibilidad |
|---|---|---|---|
| **Web (institucion)** | DID document completo + clave publica | Cuando el servidor de la institucion esta online | Depende de la institucion (SSL, uptime) |
| **CDN (Attestto)** | DID document completo + clave publica (copia respaldada) | Cuando el servidor de la institucion falla | 99.9% SLA |
| **Chain (Solana)** | Hash del DID document + hashes de VCs emitidas + timestamps | Siempre — es la prueba de integridad definitiva | 100% (blockchain) |

### Escenario: verificacion con servidor caido

```
1. Verificador recibe una VC firmada por did:web:csv.go.cr
2. Intenta resolver did:web:csv.go.cr → ERROR (SSL expirado)
3. Fallback: resuelve did:web:cosevi.attestto.id → EXITO (DID document disponible)
4. Verifica la firma de la VC contra la clave publica del DID document
5. Adicionalmente: consulta el did-registry-program en Solana
   → Confirma que el hash de la VC coincide con el anclado on-chain
   → Confirma que el DID no ha sido desactivado
6. Resultado: credencial verificada con certeza criptografica
```

**La cadena no reemplaza al servidor web — es la prueba de que la credencial existio y no fue alterada.** Aunque ambos servidores (institucion + Attestto) se caigan, el hash en Solana demuestra que la VC fue emitida en X fecha con Y contenido.

Esto responde directamente a la **observacion #5 del MICITT**: integridad documental con hashing y sellado de tiempo, blockchain opcional pero valorable. En nuestro modelo no es opcional — es la tercera capa de confianza que funciona sin servidores.

## Diagrama de Adopcion Progresiva

```
Dia 1                    Cuando este lista           Maxima soberania
  |                           |                              |
  v                           v                              v
did:web:cosevi.attestto.id  did:web:csv.go.cr              did-registry on-chain
  |                           |                              |
  | Attestto hospeda          | Institucion hospeda          | Solana hospeda
  | Zero infra                | Requiere SSL + uptime        | Zero servidor
  | Activacion inmediata      | Requiere equipo TI           | Solo keypair
  |                           |                              |
  +------ Capa 3: hash siempre anclado en Solana via did-registry-program ------+
```

**Lo importante:** Las credenciales emitidas en cualquier nivel son interoperables. Un verificador puede validar una VC firmada por `did:web:cosevi.attestto.id` o por `did:web:csv.go.cr` — el protocolo es el mismo. La migracion entre niveles no invalida las credenciales existentes. Y en todos los niveles, el hash de la credencial esta anclado on-chain como prueba de integridad.

## El Servicio de Attestto

Para el Nivel 1, Attestto ofrece:

1. **Registro de DID institucional** — Portal en `portal.attestto.id`, activacion inmediata
2. **API de emision de VCs** — La institucion envia los datos, Attestto firma y ancla
3. **Dashboard** — Credenciales emitidas, revocadas, verificaciones en tiempo real
4. **Trust Registry** — La institucion aparece automaticamente como emisor autorizado
5. **Rotacion automatica de claves** — Sin intervencion de la institucion
6. **Revocacion (StatusList2021)** — Revocar una credencial con una llamada API
7. **Anclaje automatico en blockchain** — Hash de cada VC anclado en Solana via `did-registry-program`
8. **CDN de respaldo** — Si la institucion migra a Nivel 2, `attestto.id` sigue como fallback
9. **SLA 99.9%** — Garantia de disponibilidad del endpoint DID

La institucion no necesita entender DIDs, JSON-LD, blockchain ni criptografia. Solo necesita llamar a un API con los datos de la credencial que quiere emitir. El anclaje on-chain, la resolucion DID y el respaldo CDN son automaticos.

## Relacion con la PKI Nacional (BCCR)

La firma digital del BCCR y los DIDs institucionales son **complementarios**:

| Aspecto | Firma Digital BCCR | DID Institucional |
|---|---|---|
| **Proposito** | Firmar documentos PDF/XML con valor legal | Identificar al emisor de Credenciales Verificables |
| **Formato** | PKCS#11 en tarjeta inteligente | JSON-LD con claves Ed25519 o P-256 |
| **Quien firma** | La persona fisica (funcionario) | La institucion como entidad |
| **Verificacion** | Contra la CA raiz del BCCR | Contra el documento DID del emisor |
| **Uso tipico** | Firmar un oficio, un contrato, una resolucion | Emitir una licencia de conducir digital, un dictamen medico |
| **Interoperabilidad** | Nacional (reconocido en CR por Ley 8454) | Internacional (W3C, ISO 18013-5, OpenID) |

**Escenario ideal:** Un funcionario del COSEVI firma un acto administrativo con su firma digital del BCCR (valor legal), y el sistema del COSEVI emite la VC de licencia de conducir firmada con el DID institucional `did:web:cosevi.attestto.id` (valor tecnico interoperable). Ambas firmas coexisten — una para el acto juridico, otra para la credencial portable.

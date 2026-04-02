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

```
did:sns:cosevi
```

- DID registrado en Solana Name Service — no depende de ningun servidor
- Resolucion descentralizada: no hay punto unico de falla
- La institucion controla el dominio `.sol` con su keypair
- Costo: ~$0.01/ano en renta de dominio SNS

**Quien lo usa:** Instituciones que quieran independencia total de cualquier proveedor, incluyendo Attestto.

## Diagrama de Progresion

```
Dia 1                    Cuando este lista           Si quiere soberania total
  |                           |                              |
  v                           v                              v
did:web:cosevi.attestto.id  did:web:csv.go.cr              did:sns:cosevi
  |                           |                              |
  | Attestto hospeda          | Institucion hospeda          | Blockchain hospeda
  | Zero infra                | Requiere SSL + uptime        | Zero servidor
  | Activacion inmediata      | Requiere equipo TI           | Requiere keypair mgmt
```

**Lo importante:** Las credenciales emitidas en cualquier nivel son interoperables. Un verificador puede validar una VC firmada por `did:web:cosevi.attestto.id` o por `did:web:csv.go.cr` — el protocolo es el mismo. La migracion entre niveles no invalida las credenciales existentes.

## El Servicio de Attestto

Para el Nivel 1, Attestto ofrece:

1. **Registro de DID institucional** — Portal en `portal.attestto.id`, activacion inmediata
2. **API de emision de VCs** — La institucion envia los datos, Attestto firma y ancla
3. **Dashboard** — Credenciales emitidas, revocadas, verificaciones en tiempo real
4. **Trust Registry** — La institucion aparece automaticamente como emisor autorizado
5. **Rotacion automatica de claves** — Sin intervencion de la institucion
6. **Revocacion (StatusList2021)** — Revocar una credencial con una llamada API
7. **Anclaje en blockchain** — Opcional, hash de cada VC anclado en Solana
8. **SLA 99.9%** — Garantia de disponibilidad del endpoint DID

La institucion no necesita entender DIDs, JSON-LD ni criptografia. Solo necesita llamar a un API con los datos de la credencial que quiere emitir.

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

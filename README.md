# cr-vc-schemas

Propuesta de esquemas JSON-LD y JSON Schema para Credenciales Verificables del ecosistema vial de Costa Rica.

> **Propuesta tecnica abierta.** Este repositorio contiene una propuesta de esquemas para credenciales verificables del ecosistema vial costarricense, desarrollada por [Attestto Open](https://attestto.org). **No es un estandar oficial.** Los esquemas estan disenados para ser evaluados, modificados y adoptados por las instituciones competentes (COSEVI, MICITT, DGEV) a traves de un proceso de revision abierto. Invitamos a todas las partes interesadas a revisar, comentar y contribuir.

## Esquemas

| Esquema | Tipo de VC | Emisor | Directorio |
|---|---|---|---|
| **DrivingLicense** | Licencia de conducir digital (mDL, ISO 18013-5) | COSEVI/DGEV | `schemas/mdl/` |
| **TheoreticalTestResult** | Prueba teorica (conocimientos, en linea o presencial) | DGEV / proveedor certificado | `schemas/driving-test/` |
| **PracticalTestResult** | Prueba practica (conduccion real con evaluador) | DGEV / proveedor certificado | `schemas/driving-test/` |
| **MedicalFitnessCredential** | Dictamen medico de aptitud | Consultorio autorizado | `schemas/medical/` |
| **VehicleRegistration** | Registro vehicular (placa) | Registro Nacional | `schemas/vehicle/` |
| **VehicleTechnicalReview** | Revision tecnica (RTV) | Centro RTV | `schemas/vehicle/` |
| **CirculationRights** | Derechos de circulacion (marchamo) | INS | `schemas/vehicle/` |
| **SOATCredential** | Seguro obligatorio (SOAT) | INS | `schemas/insurance/` |
| **DriverIdentity** | Identidad del conductor | TSE / DGME / banco / COSEVI | `schemas/identity/` |
| **TrafficViolation** | Multa de transito | COSEVI | `schemas/violations/` |
| **AccidentReport** | Parte de accidente | COSEVI / INS | `schemas/violations/` |

## Estructura

```
cr-vc-schemas/
  context/
    cr-driving-v1.jsonld          Contexto compartido (namespace comun)
  schemas/
    mdl/
      DrivingLicense.jsonld       Ejemplo de VC
      DrivingLicense.schema.json  JSON Schema para validacion
    driving-test/
      TheoreticalTestResult.jsonld + .schema.json
      PracticalTestResult.jsonld + .schema.json
    medical/
      MedicalFitnessCredential.jsonld
      MedicalFitnessCredential.schema.json
    vehicle/
      VehicleRegistration.jsonld + .schema.json
      VehicleTechnicalReview.jsonld + .schema.json
      CirculationRights.jsonld + .schema.json
    insurance/
      SOATCredential.jsonld + .schema.json
    identity/
      DriverIdentity.jsonld + .schema.json
    violations/
      TrafficViolation.jsonld + .schema.json
      AccidentReport.jsonld + .schema.json
  examples/                       Ejemplos completos con datos ficticios
  docs/                           Documentacion adicional
  LICENSE                         Apache 2.0
```

## Contexto JSON-LD

Todos los esquemas usan el contexto compartido:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemas.attestto.org/cr/driving/v1"
  ]
}
```

El contexto propuesto agrupa los tipos y propiedades en un namespace: `https://schemas.attestto.org/cr/driving/v1#`. Este namespace es provisional y puede cambiar si las instituciones competentes adoptan un dominio oficial (ej. `schemas.cosevi.go.cr`).

## Principios de Diseno (Propuestos)

1. **Privacidad por defecto** — Los esquemas NUNCA incluyen datos de salud (solo resultado funcional), NUNCA exponen numeros de identidad completos (solo referencias parciales o hashes).

2. **Interoperabilidad** — Compatible con W3C Verifiable Credentials Data Model v2.0, JSON-LD, y los protocolos OpenID4VCI/OpenID4VP.

3. **Verificacion offline** — Cada VC incluye `credentialStatus` con StatusList2021 para verificacion de revocacion sin servidor centralizado.

4. **Neutralidad tecnologica** — Los esquemas no dependen de ningun proveedor, plataforma ni blockchain especificos. Son compatibles con cualquier implementacion que soporte JSON-LD + W3C VC.

## Anclaje On-Chain (Solana Attestation Service)

Los esquemas de este repositorio estan anclados en Solana via el [Solana Attestation Service (SAS)](https://attest.solana.com/) — un protocolo abierto y permisionless de la Solana Foundation. No se requiere un programa propio.

### Despliegue actual (Devnet)

| Entidad | PDA | Red |
|---|---|---|
| **CR-VIAL-ECOSYSTEM** (credencial) | [`GfqJFXiUVBFLHk1J7nooR9Vv1AaK3J8M3Ygz3RrzrM6u`](https://explorer.solana.com/address/GfqJFXiUVBFLHk1J7nooR9Vv1AaK3J8M3Ygz3RrzrM6u?cluster=devnet) | devnet |
| **INSTITUTION** (esquema) | [`CzvQmmyFtQg6yLr6hRJvfjAyAaA38paGcXiRTQQVHAmW`](https://explorer.solana.com/address/CzvQmmyFtQg6yLr6hRJvfjAyAaA38paGcXiRTQQVHAmW?cluster=devnet) | devnet |
| **CREDENTIAL-ANCHOR** (esquema) | [`CsvrCdCyiE8QyV8uZF2xZ5Cj9PpfoKkdSK7dG7K9hSW5`](https://explorer.solana.com/address/CsvrCdCyiE8QyV8uZF2xZ5Cj9PpfoKkdSK7dG7K9hSW5?cluster=devnet) | devnet |
| **VEHICLE-HISTORY** (esquema) | [`6Gn5M2q3BezbqaWQdrrh1w3xuizaJjgmdhwRpNnWjzJZ`](https://explorer.solana.com/address/6Gn5M2q3BezbqaWQdrrh1w3xuizaJjgmdhwRpNnWjzJZ?cluster=devnet) | devnet |

Ver [`docs/deployment-devnet.json`](./docs/deployment-devnet.json) para el registro completo.

### Tres esquemas, tres tipos de entidad

1. **INSTITUTION** — Anclas de confianza. Registra instituciones autorizadas (COSEVI, DGEV, bancos, consultorios) y los tipos de credencial que pueden emitir. Un verificador consulta este esquema para validar que el emisor de una VC esta autorizado.

2. **CREDENTIAL-ANCHOR** — Anclaje de hashes de VCs para personas. Modelo de verificacion en 3 capas: web (emisor) → CDN (attestto.id) → cadena (SAS). Tambien sirve como indice de recuperacion si el titular pierde su dispositivo. Sin PII on-chain — solo hashes.

3. **VEHICLE-HISTORY** — Historial de vida del vehiculo. Registros de matricula, RTV, marchamo, SOAT. Transferible (los vehiculos cambian de dueno). Historial publico, sin PII.

### Modelo de gobernanza on-chain

**Devnet (actual):** Autoridad de desarrollo — `Att2ARRaK2VrAbmUvNzwUGJUom8cPVCYe65azSbb9oR5`

**Mainnet (planificado):** Multisig multi-institucional via [Squads Protocol v4](https://v4.squads.so):

| Firmante | Rol |
|---|---|
| **COSEVI / MOPT** | Regulador — gobierno del ecosistema vial |
| **MICITT** | Supervision tecnica — neutralidad y estandares |
| **Desarrollador(es)** | Operacion tecnica — Attestto Open u otro proveedor |

Threshold 2-of-3: ninguna parte puede unilateralmente agregar/remover anclas de confianza, pausar esquemas o revocar attestations. La infraestructura no pertenece al contratista.

Este modelo responde directamente a las observaciones del MICITT:
- **Obs. 1 (Neutralidad tecnologica):** La infraestructura es un protocolo abierto, no un producto propietario.
- **Obs. 7 (Reversibilidad y portabilidad):** La autoridad es transferible — el Estado puede asumir control total en cualquier momento.

### Scripts de despliegue

```bash
cd scripts && pnpm install

# Desplegar credencial + esquemas en devnet
pnpm deploy:devnet

# Crear attestations de demo
pnpm demo:attest

# Verificar estado de los esquemas on-chain
pnpm verify

# Verificar un attestation especifico
pnpm verify -- --schema INSTITUTION --nonce <address>
```

## Uso

### Validar una VC contra un esquema

```bash
# Usando ajv-cli
npx ajv validate -s schemas/mdl/DrivingLicense.schema.json -d mi-credencial.json
```

### Referenciar el contexto en una VC

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemas.attestto.org/cr/driving/v1"
  ],
  "type": ["VerifiableCredential", "DrivingLicense"],
  "issuer": "did:web:cosevi.go.cr",
  "credentialSubject": {
    "id": "did:example:titular",
    "license": {
      "licenseNumber": "CI-100000000",
      "categories": ["B"],
      "issueDate": "2026-04-01",
      "expiresAt": "2032-04-01",
      "status": "active",
      "points": 12,
      "issuingAuthority": "did:web:cosevi.go.cr"
    }
  }
}
```

> **Nota:** El numero de licencia en Costa Rica es el mismo numero de cedula del titular (formato `CI-XXXXXXXXX`). El metodo DID del ejemplo (`did:web`) es ilustrativo — el metodo definitivo se define por las instituciones competentes.

## Ecosistema

Indice completo: [Attestto-com/attestto-open](https://github.com/Attestto-com/attestto-open)

| Repositorio | Que hace |
|---|---|
| [vc-sdk](https://github.com/Attestto-com/vc-sdk) | SDK universal W3C VC (TypeScript) |
| [cr-vc-sdk](https://github.com/Attestto-com/cr-vc-sdk) | SDK ecosistema vial CR (TypeScript) |
| [cr-vc-sdk-dotnet](https://github.com/Attestto-com/cr-vc-sdk-dotnet) | SDK ecosistema vial CR (.NET 8) |
| [did-sns-spec](https://github.com/Attestto-com/did-sns-spec) | Especificacion W3C del metodo `did:sns` |
| [did-sns-resolver](https://github.com/Attestto-com/did-sns-resolver) | Universal Resolver para did:sns |
| [did-method-checklist](https://github.com/Attestto-com/did-method-checklist) | Framework de evaluacion de metodos DID |
| [id-wallet-adapter](https://github.com/Attestto-com/id-wallet-adapter) | Descubrimiento de wallets |

## Referencias

- [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [W3C VC Use Cases](https://www.w3.org/TR/vc-use-cases/) — bounds of authority, verification vs validation, verifier business rules
- [ISO/IEC 18013-5 (mDL)](https://www.iso.org/standard/69084.html)
- [W3C CCG Verifiable Driver's License Vocabulary](https://w3c-ccg.github.io/vdl-vocab/)
- [W3C StatusList2021](https://www.w3.org/TR/vc-status-list/)
- [OpenID4VCI](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
- [OpenID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [Solana Attestation Service (SAS)](https://github.com/solana-labs/solana-attestation-service)
- [INTEROP.md](./INTEROP.md) — Mapeo completo CR → ISO 18013-5 → W3C VDL
- [docs/did-adoption-model.md](./docs/did-adoption-model.md) — Modelo de adopcion progresiva de DIDs

## Licencia

Apache 2.0 — Ver [LICENSE](./LICENSE)

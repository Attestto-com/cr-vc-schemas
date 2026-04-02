# cr-vc-schemas

Esquemas JSON-LD y JSON Schema para Credenciales Verificables del ecosistema vial de Costa Rica.

> **Bien publico.** Estos esquemas definen el vocabulario comun para que cualquier institucion — COSEVI, INS, RTV, Hacienda, consultorios medicos, bancos — pueda emitir y verificar credenciales digitales interoperables sin acuerdos bilaterales.

## Esquemas

| Esquema | Tipo de VC | Emisor | Directorio |
|---|---|---|---|
| **DrivingLicense** | Licencia de conducir digital (mDL, ISO 18013-5) | COSEVI/DGEV | `schemas/mdl/` |
| **DrivingTestResult** | Resultado de prueba teorica | DGEV / proveedor certificado | `schemas/driving-test/` |
| **MedicalFitnessCredential** | Dictamen medico de aptitud | Consultorio autorizado | `schemas/medical/` |
| **VehicleRegistration** | Registro vehicular (placa) | Registro Nacional | `schemas/vehicle/` |
| **VehicleTechnicalReview** | Revision tecnica (RTV) | Centro RTV | `schemas/vehicle/` |
| **CirculationRights** | Derechos de circulacion (marchamo) | Hacienda / Municipalidad | `schemas/vehicle/` |
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
      DrivingTestResult.jsonld
      DrivingTestResult.schema.json
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

El contexto define los tipos y propiedades para todo el ecosistema vial en un solo namespace: `https://schemas.attestto.org/cr/driving/v1#`

## Principios de Diseno

1. **Privacidad por defecto** — Los esquemas NUNCA incluyen datos de salud (solo resultado funcional), NUNCA exponen numeros de identidad completos (solo referencias parciales o hashes).

2. **Interoperabilidad** — Compatible con W3C Verifiable Credentials Data Model v2.0, JSON-LD, y los protocolos OpenID4VCI/OpenID4VP.

3. **Verificacion offline** — Cada VC incluye `credentialStatus` con StatusList2021 para verificacion de revocacion sin servidor centralizado.

4. **Neutralidad tecnologica** — Los esquemas no dependen de ningun proveedor, plataforma ni blockchain especificos. Son compatibles con cualquier implementacion que soporte JSON-LD + W3C VC.

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
  "issuer": "did:sns:cosevi",
  "credentialSubject": {
    "id": "did:sns:conductor",
    "license": {
      "licenseNumber": "CR-2026-001234",
      "categories": ["B"],
      "issueDate": "2026-04-01",
      "expiresAt": "2032-04-01",
      "status": "active",
      "points": 12,
      "issuingAuthority": "did:sns:cosevi"
    }
  }
}
```

## Referencias

- [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [ISO/IEC 18013-5 (mDL)](https://www.iso.org/standard/69084.html)
- [W3C StatusList2021](https://www.w3.org/TR/vc-status-list/)
- [OpenID4VCI](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
- [OpenID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [ATT-152 — Arquitectura SSI Nacional](https://attestto.atlassian.net/browse/ATT-152)
- [ATT-165 — Inventario SDK/Esquemas](https://attestto.atlassian.net/browse/ATT-165)

## Licencia

Apache 2.0 — Ver [LICENSE](./LICENSE)

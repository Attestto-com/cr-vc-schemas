# Interoperabilidad con Estandares Internacionales

> **Nota:** Los esquemas en este repositorio son una **propuesta tecnica** de Attestto Open. Este documento describe como la propuesta se alinea con los estandares internacionales para facilitar la evaluacion por parte de las instituciones competentes.

## Estandares de Referencia

| Estandar | Organizacion | Relevancia |
|---|---|---|
| **ISO/IEC 18013-5:2021** | ISO | Formato mDL (mobile Driving License). Define data elements en namespace `org.iso.18013.5.1` con formato CBOR/mdoc. |
| **ISO/IEC TS 18013-7:2025** | ISO | Verificacion online de mDL. Complementa la verificacion offline de 18013-5. |
| **W3C VDL Vocabulary v0.1** | W3C CCG | Vocabulario JSON-LD experimental que mapea ISO 18013-5 a Verifiable Credentials. Namespace: `https://w3id.org/vdl/v2#` |
| **W3C AAMVA VDL Extensions** | W3C CCG | Extensiones para America del Norte. Namespace: `https://w3id.org/vdl/aamva/v1#` |
| **W3C VC Data Model v2.0** | W3C | Modelo base para todas las credenciales verificables. Publicado como W3C Recommendation mayo 2025. |
| **EUDI Wallet ARF** | EU | Arquitectura de referencia para wallets de identidad europeas. Requiere mDL para finales de 2026. |
| **OpenID4VCI 1.0** | OpenID Foundation | Protocolo de emision de credenciales a wallets. Finalizado septiembre 2025. |
| **OpenID4VP 1.0** | OpenID Foundation | Protocolo de presentacion de credenciales desde wallets. |
| **W3C StatusList2021** | W3C | Verificacion de revocacion sin servidor centralizado. |

## Estrategia de Interoperabilidad

### Namespace propio + mapeo a W3C VDL

Nuestros esquemas usan un namespace propio (`schemas.attestto.org/cr/driving/v1#`) porque incluyen campos especificos de Costa Rica que no existen en ISO 18013-5:

- `points` — sistema de puntos costarricense (0-12)
- `bloodType` — tipo de sangre (requerido en licencia CR)
- `categories` con clasificacion CR (A1-E3)
- `examVersionHash` — hash del banco de preguntas de la DGEV
- `proctoring` — telemetria de supervision

Para los campos que SI tienen equivalente en ISO 18013-5, el contexto JSON-LD incluye **ambos** — el nombre CR y el nombre W3C VDL:

```json
{
  "licenseNumber": { "@id": "cr:licenseNumber" },
  "document_number": { "@id": "vdl:document_number" },

  "issueDate": { "@id": "cr:issueDate" },
  "issue_date": { "@id": "vdl:issue_date" },

  "expiresAt": { "@id": "cr:expiresAt" },
  "expiry_date": { "@id": "vdl:expiry_date" }
}
```

Esto significa que un emisor puede incluir ambos campos, o que un verificador que entienda `w3id.org/vdl/v2` puede leer los campos VDL directamente.

## Tabla de Mapeo: CR → ISO 18013-5 → W3C VDL

### DrivingLicense

| Campo CR | ISO 18013-5 Data Element | W3C VDL Property | Namespace ISO | Notas |
|---|---|---|---|---|
| `licenseNumber` | `document_number` | `document_number` | `org.iso.18013.5.1` | Equivalente directo |
| `categories` | `driving_privileges` | `driving_privileges` | `org.iso.18013.5.1` | Estructura diferente: ISO usa JSON con vehicle_category_code + issue/expiry per category |
| `issueDate` | `issue_date` | `issue_date` | `org.iso.18013.5.1` | Formato: ISO usa cbor tag 1004 (full-date), nosotros xsd:date |
| `expiresAt` | `expiry_date` | `expiry_date` | `org.iso.18013.5.1` | Equivalente directo |
| `photoHash` | `portrait` | `portrait` | `org.iso.18013.5.1` | ISO usa imagen completa (JPEG2000/JPEG), nosotros SHA-256 del retrato por privacidad |
| `issuingAuthority` | `issuing_authority` | `issuing_authority` | `org.iso.18013.5.1` | ISO usa string, nosotros DID |
| — | `issuing_country` | `issuing_country` | `org.iso.18013.5.1` | Siempre "CR" para nuestro caso. Disponible en contexto VDL. |
| — | `un_distinguishing_sign` | `un_distinguishing_sign` | `org.iso.18013.5.1` | "CR" per Convencion de Viena. Disponible en contexto VDL. |
| `points` | — | — | — | **CR-especifico.** No existe en ISO 18013-5. |
| `bloodType` | — | — | — | **CR-especifico.** Requerido por regulacion costarricense. |
| `status` | — | — | — | **CR-especifico.** Estado de la credencial (active/suspended/revoked). ISO usa StatusList. |
| — | `family_name` | `family_name` | `org.iso.18013.5.1` | Disponible en contexto VDL para interop. |
| — | `given_name` | `given_name` | `org.iso.18013.5.1` | Disponible en contexto VDL para interop. |
| — | `birth_date` | `birth_date` | `org.iso.18013.5.1` | Disponible en contexto VDL para interop. |
| — | `sex` | `sex` | `org.iso.18013.5.1` | ISO/IEC 5218 values. Disponible en contexto VDL. |
| — | `age_over_18` | `age_over_18` | `org.iso.18013.5.1` | Boolean para selective disclosure. Disponible en contexto VDL. |
| — | `nationality` | `nationality` | `org.iso.18013.5.1` | ISO 3166-1 alpha-2. Disponible en contexto VDL. |

### DriverIdentity

| Campo CR | ISO 18013-5 Data Element | W3C VDL Property | Notas |
|---|---|---|---|
| `fullName` | — | — | CR usa nombre completo. VDL separa en family_name + given_name. |
| `dateOfBirth` | `birth_date` | `birth_date` | Mapeo directo disponible en contexto. |
| `nationality` | `nationality` | `nationality` | Mapeo directo disponible en contexto. |
| `nationalIdType` | — | — | CR-especifico (cedula, dimex, pasaporte). |
| `nationalIdRef` | — | — | CR-especifico. Referencia parcial por privacidad. |

## Esquemas sin Equivalente ISO

Los siguientes esquemas son **completamente CR-especificos** y no tienen equivalente en estandares internacionales. Son extensiones del ecosistema vial nacional:

| Esquema | Justificacion |
|---|---|
| `TheoreticalTestResult` | No existe estandar internacional para resultados de pruebas teoricas como VC. |
| `PracticalTestResult` | No existe estandar internacional para evaluacion practica como VC. |
| `MedicalFitnessCredential` | Requisito regulatorio CR. La UE tiene equivalentes pero sin esquema JSON-LD estandar. |
| `VehicleRegistration` | Cada pais tiene su propio formato de registro vehicular. |
| `VehicleTechnicalReview` | Equivalente a ITV (ES), MOT (UK), TUV (DE) pero sin esquema comun. |
| `CirculationRights` | Marchamo: concepto CR-especifico. |
| `SOATCredential` | Seguro obligatorio: cada pais define su propio formato. |
| `TrafficViolation` | Multas: jurisdiccion-especifico. |
| `AccidentReport` | Partes de accidente: jurisdiccion-especifico. |

## Interoperabilidad Regional (LATAM)

No existe un estandar LATAM para licencias digitales. Costa Rica seria el primer pais de la region en publicar esquemas JSON-LD abiertos para su ecosistema vial.

**Oportunidad:** Si otros paises centroamericanos (Panama, Guatemala, El Salvador) adoptan ISO 18013-5 para sus mDLs, pueden usar estos esquemas como base — reemplazando los campos CR-especificos por los suyos pero manteniendo la estructura compartida y la interoperabilidad via el vocabulario VDL comun.

## Como Verificar Interoperabilidad

Un verificador que entienda W3C VDL puede leer una licencia CR si el emisor incluye los campos VDL:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemas.attestto.org/cr/driving/v1"
  ],
  "type": ["VerifiableCredential", "DrivingLicense"],
  "credentialSubject": {
    "id": "did:sns:conductor",
    "license": {
      "licenseNumber": "CR-2026-001234",
      "document_number": "CR-2026-001234",
      "categories": ["B"],
      "driving_privileges": [{"vehicle_category_code": "B"}],
      "issueDate": "2026-04-01",
      "issue_date": "2026-04-01",
      "expiresAt": "2032-04-01",
      "expiry_date": "2032-04-01",
      "family_name": "Doe",
      "given_name": "Jane",
      "birth_date": "1990-01-15",
      "issuing_country": "CR",
      "un_distinguishing_sign": "CR",
      "age_over_18": true,
      "status": "active",
      "points": 12,
      "bloodType": "O+"
    }
  }
}
```

Los campos VDL (`document_number`, `issue_date`, `family_name`, etc.) son leibles por cualquier verificador compatible con W3C VDL. Los campos CR (`points`, `bloodType`, `status`) son ignorados por verificadores que no conozcan nuestro namespace — sin romper la verificacion.

## Referencias

- [W3C CCG Verifiable Driver's License Vocabulary v0.1](https://w3c-ccg.github.io/vdl-vocab/)
- [ISO/IEC 18013-5:2021](https://www.iso.org/standard/69084.html)
- [ISO/IEC TS 18013-7:2025](https://www.iso.org/standard/91081.html)
- [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [EUDI Wallet Architecture Reference Framework](https://eu-digital-identity-wallet.github.io/eudi-doc-architecture-and-reference-framework/2.4.0/)
- [OpenID4VCI 1.0](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)

# Como Contribuir a los Esquemas CR Vial

Este repositorio define los esquemas de Credenciales Verificables para el ecosistema vial de Costa Rica. Los esquemas son **bien publico** — cualquier institucion, proveedor o desarrollador puede proponer cambios.

## Quien puede contribuir

- **Instituciones del Estado** (COSEVI, DGEV, MICITT, INS, Registro Nacional, Hacienda, TSE, DGME)
- **Proveedores certificados** (centros de prueba teorica, centros RTV, consultorios medicos)
- **Empresas adjudicatarias** del servicio administrado de licencias
- **Desarrolladores** que implementen los SDKs o aplicaciones de referencia
- **Comunidad tecnica** costarricense e internacional

## Tipos de contribucion

### 1. Agregar un campo a un esquema existente

**Ejemplo:** El COSEVI necesita agregar un campo `donante_organos` al esquema `DrivingLicense`.

**Proceso:**
1. Abrir un Issue con el titulo: `[DrivingLicense] Agregar campo: donante_organos`
2. Describir:
   - Que campo se necesita
   - Tipo de dato (string, integer, boolean, date, etc.)
   - Si es obligatorio u opcional
   - Justificacion regulatoria (ley, decreto, circular que lo requiere)
   - Si tiene equivalente en ISO 18013-5 o W3C VDL (ver `INTEROP.md`)
3. El equipo tecnico revisa la compatibilidad con el contexto JSON-LD
4. Se crea un Pull Request con el cambio
5. Se publica una nueva version del esquema

### 2. Crear un esquema nuevo

**Ejemplo:** La CCSS necesita un esquema `HealthInsuranceCredential` para verificar que el conductor tiene seguro de salud vigente.

**Proceso:**
1. Abrir un Issue con el titulo: `[Nuevo esquema] HealthInsuranceCredential`
2. Describir:
   - Que tipo de credencial es
   - Quien la emite (que institucion, con que autoridad)
   - Que campos necesita (listar todos con tipo y descripcion)
   - Quien la verifica y en que contexto
   - Si algun campo contiene PII (datos personales) — ver reglas de privacidad abajo
3. El equipo tecnico crea el esquema JSON-LD + JSON Schema
4. Se agrega al contexto compartido `cr-driving-v1.jsonld`
5. Se documenta en la tabla de interoperabilidad si aplica

### 3. Reportar un error en un esquema

Abrir un Issue con el titulo: `[Bug] Nombre del esquema — descripcion del error`

### 4. Proponer mejora de interoperabilidad

Si un estandar internacional (ISO, W3C, EUDI) publica un nuevo vocabulario relevante, abrir un Issue con:
- Enlace al estandar
- Campos que se deben mapear
- Propuesta de mapeo en el contexto JSON-LD

## Reglas de privacidad para esquemas

Todos los esquemas DEBEN seguir estas reglas:

1. **NUNCA incluir datos de salud** — Solo resultados funcionales (apto/no apto), nunca diagnosticos clinicos
2. **NUNCA incluir numeros de identidad completos** — Solo referencias parciales o hashes
3. **NUNCA incluir datos biometricos crudos** — Solo hashes de retratos, nunca la imagen
4. **Selective disclosure por defecto** — Los campos sensibles deben poder presentarse de forma selectiva (ej. `age_over_18: true` en lugar de `dateOfBirth`)
5. **Los datos de la blockchain NUNCA contienen PII** — Solo hashes, firmas y timestamps

## Estructura de un esquema

Cada esquema tiene dos archivos:

```
schemas/<dominio>/
  NombreDelEsquema.jsonld         # Ejemplo de credencial (plantilla JSON-LD)
  NombreDelEsquema.schema.json    # JSON Schema para validacion programatica
```

### Plantilla JSON-LD (`.jsonld`)

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemas.attestto.org/cr/driving/v1"
  ],
  "type": ["VerifiableCredential", "NombreDelEsquema"],
  "credentialSubject": {
    "id": "did:sns:sujeto-did",
    "propiedad": {
      "type": "NombreDelEsquemaValue",
      "campo1": "descripcion del tipo y valores posibles",
      "campo2": "descripcion del tipo y valores posibles"
    }
  },
  "issuer": "did:sns:emisor-did",
  "issuanceDate": "dateTime",
  "credentialStatus": {
    "type": "StatusList2021Entry",
    "statusPurpose": "revocation"
  }
}
```

### JSON Schema (`.schema.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.attestto.org/cr/driving/v1/NombreDelEsquema.schema.json",
  "title": "Titulo en espanol",
  "description": "Descripcion clara del proposito de la credencial",
  "type": "object",
  "required": ["credentialSubject"],
  "properties": {
    "credentialSubject": {
      "type": "object",
      "required": ["id", "propiedad"],
      "properties": {
        "id": { "type": "string", "pattern": "^did:" },
        "propiedad": {
          "type": "object",
          "required": ["campo1"],
          "properties": {
            "campo1": { "type": "string", "description": "Descripcion en espanol" }
          }
        }
      }
    }
  }
}
```

## Convenciones de nombres

- **Tipos de VC:** PascalCase en ingles (`DrivingLicense`, `TheoreticalTestResult`)
- **Campos:** camelCase (`licenseNumber`, `testDate`, `evaluatorDID`)
- **Campos VDL/ISO:** snake_case para mantener compatibilidad (`document_number`, `issue_date`)
- **Enums:** minusculas con guion bajo (`in-person`, `remote-biometric`, `approved`, `failed`)
- **DIDs:** siempre con sufijo `DID` (`evaluatorDID`, `vehicleDID`, `clinicDID`)
- **Fechas:** `xsd:date` para fechas, `xsd:dateTime` para timestamps

## Versionado

Los esquemas siguen versionado semantico en el namespace:

- `v1` — version actual: `schemas.attestto.org/cr/driving/v1`
- `v2` — se crearia cuando haya cambios incompatibles (remover campos obligatorios, cambiar tipos)
- Agregar campos opcionales NO requiere nueva version

## Proceso de revision

1. Todo cambio pasa por Pull Request
2. Al menos 1 aprobacion de un mantenedor
3. Los cambios que afecten la interoperabilidad (contexto JSON-LD, campos VDL) requieren 2 aprobaciones
4. Los esquemas nuevos requieren un ejemplo completo en `examples/`

## Contacto

- **Issues:** Usar el tracker de GitHub de este repositorio
- **Tecnico:** Attestto Open — [attestto.org](https://attestto.org)
- **Institucional:** Para consultas de integracion, contactar via el portal de integraciones

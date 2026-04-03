/**
 * CR Vial Ecosystem — SAS Schema Definitions
 *
 * Three entity types anchored on-chain via Solana Attestation Service:
 *   1. INSTITUTION   — Trust anchors (COSEVI, DGEV, banks, clinics, etc.)
 *   2. CREDENTIAL    — VC hash anchoring for persons (recovery index)
 *   3. VEHICLE       — Vehicle lifecycle history (RTV, marchamo, SOAT, etc.)
 *
 * Layout byte mapping (from SAS compact layout):
 *   0=u8, 1=u16, 2=u32, 3=u64, 5=i8, 8=i64, 10=bool, 12=String, 13=Vec<u8>
 */

/** SAS layout type codes */
const T = {
  u8: 0,
  u16: 1,
  u32: 2,
  u64: 3,
  i64: 8,
  bool: 10,
  string: 12,
  bytes: 13,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Credential (top-level)
// ─────────────────────────────────────────────────────────────────────────────

export const CREDENTIAL_NAME = 'CR-VIAL-ECOSYSTEM'

// ─────────────────────────────────────────────────────────────────────────────
// Schema 1: INSTITUTION — Trust anchors
// ─────────────────────────────────────────────────────────────────────────────
// Who: COSEVI, DGEV, Registro Nacional, INS, banks, clinics, RTV centers
// What: Registers an institution as an authorized issuer for specific VC types
// Why: Officers and verifiers look up the trust anchor to validate a VC issuer

export const INSTITUTION_SCHEMA = {
  name: 'INSTITUTION',
  version: 1,
  description:
    'Trust anchor registration — authorized VC issuers in the CR vial ecosystem. ' +
    'Each attestation registers an institution (by DID hash) and the credential ' +
    'types it is authorized to issue.',
  fields: [
    'did_hash',          // sha256 of the institution DID (e.g. did:web:cosevi.go.cr)
    'name_hash',         // sha256 of institution legal name (privacy: no PII on-chain)
    'jurisdiction',      // ISO 3166-1 alpha-2 (e.g. "CR")
    'trust_level',       // 0=self-declared, 1=government, 2=regulated, 3=delegated
    'credential_types',  // comma-separated schema names this institution can issue
    'active',            // whether this trust anchor is currently active
  ],
  layout: Buffer.from([
    T.string,  // did_hash
    T.string,  // name_hash
    T.string,  // jurisdiction
    T.u8,      // trust_level
    T.string,  // credential_types
    T.bool,    // active
  ]),
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema 2: CREDENTIAL — VC hash anchoring (persons)
// ─────────────────────────────────────────────────────────────────────────────
// Who: Any holder who received a VC (mDL, medical fitness, test result, etc.)
// What: Anchors the hash of a verifiable credential for integrity + recovery
// Why: 3-layer verification: web (issuer) → CDN (attestto.id) → chain (SAS)
//      Also serves as recovery index if the holder loses their device

export const CREDENTIAL_SCHEMA = {
  name: 'CREDENTIAL-ANCHOR',
  version: 1,
  description:
    'VC hash anchoring for the 3-layer verification model. ' +
    'Each attestation stores the hash of a verifiable credential, linking ' +
    'holder DID, issuer DID, and credential type. No PII on-chain — only hashes.',
  fields: [
    'holder_did_hash',   // sha256 of holder DID
    'issuer_did_hash',   // sha256 of issuer DID
    'vc_hash',           // sha256 of the full VC document
    'credential_type',   // schema name (e.g. "DrivingLicense", "MedicalFitness")
    'issued_at',         // unix timestamp
    'revoked',           // whether this credential has been revoked
  ],
  layout: Buffer.from([
    T.string,  // holder_did_hash
    T.string,  // issuer_did_hash
    T.string,  // vc_hash
    T.string,  // credential_type
    T.i64,     // issued_at
    T.bool,    // revoked
  ]),
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema 3: VEHICLE — Vehicle lifecycle history
// ─────────────────────────────────────────────────────────────────────────────
// Who: Vehicles (by VIN/plate hash), NOT persons
// What: Anchors vehicle-related credentials (registration, RTV, marchamo, SOAT)
// Why: Public history — any officer can verify a vehicle's credential status
//      Transferable (unlike SBTs) because vehicles change owners

export const VEHICLE_SCHEMA = {
  name: 'VEHICLE-HISTORY',
  version: 1,
  description:
    'Vehicle lifecycle attestations — registration, RTV, marchamo, SOAT. ' +
    'Each attestation anchors a vehicle credential by VIN hash + plate hash. ' +
    'Transferable (vehicles change owners). Public history, no PII.',
  fields: [
    'vin_hash',          // sha256 of VIN
    'plate_hash',        // sha256 of plate number
    'owner_did_hash',    // sha256 of current owner DID
    'credential_type',   // schema name (e.g. "VehicleRegistration", "TechnicalReview")
    'vc_hash',           // sha256 of the full VC document
    'issued_at',         // unix timestamp
  ],
  layout: Buffer.from([
    T.string,  // vin_hash
    T.string,  // plate_hash
    T.string,  // owner_did_hash
    T.string,  // credential_type
    T.string,  // vc_hash
    T.i64,     // issued_at
  ]),
}

export const ALL_SCHEMAS = [INSTITUTION_SCHEMA, CREDENTIAL_SCHEMA, VEHICLE_SCHEMA]

/**
 * CR Vial Ecosystem — Demo Attestations
 *
 * Creates sample attestations for each schema to demonstrate the flow.
 * Reads the deployment record from docs/deployment-devnet.json.
 *
 * Usage:
 *   pnpm demo:attest
 */

import {
  getCreateAttestationInstruction,
  fetchSchema,
  serializeAttestationData,
  deriveAttestationPda,
} from 'sas-lib'
import {
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  type Instruction,
  type TransactionSigner,
  type Blockhash,
  type Signature,
  type Address,
  type SolanaClient,
} from 'gill'
import { loadKeypairSignerFromFile } from 'gill/node'
import { estimateComputeUnitLimitFactory } from 'gill/programs'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

async function sendAndConfirm(
  client: SolanaClient,
  payer: TransactionSigner,
  instructions: Instruction[],
  label: string
): Promise<Signature> {
  const simulationTx = createTransaction({
    version: 'legacy',
    feePayer: payer,
    instructions,
    latestBlockhash: {
      blockhash: '11111111111111111111111111111111' as Blockhash,
      lastValidBlockHeight: 0n,
    },
    computeUnitLimit: 1_400_000,
    computeUnitPrice: 1,
  })

  const estimateCompute = estimateComputeUnitLimitFactory({ rpc: client.rpc })
  const computeUnitLimit = await estimateCompute(simulationTx)
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

  const tx = createTransaction({
    version: 'legacy',
    feePayer: payer,
    instructions,
    latestBlockhash,
    computeUnitLimit,
    computeUnitPrice: 1,
  })

  const signature = await client.sendAndConfirmTransaction(tx)
  console.log(`  [ok] ${label}`)
  console.log(`       tx: ${signature}`)
  return signature
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Data (all fictitious — no real PII)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_INSTITUTION = {
  did_hash: sha256('did:web:cosevi.go.cr'),
  name_hash: sha256('Consejo de Seguridad Vial'),
  jurisdiction: 'CR',
  trust_level: 1, // government
  credential_types: 'DrivingLicense,TheoreticalTestResult,PracticalTestResult',
  active: true,
}

const DEMO_CREDENTIAL = {
  holder_did_hash: sha256('did:web:attestto.id:user:demo-citizen'),
  issuer_did_hash: sha256('did:web:cosevi.go.cr'),
  vc_hash: sha256('demo-driving-license-vc-content-hash'),
  credential_type: 'DrivingLicense',
  issued_at: BigInt(Math.floor(Date.now() / 1000)),
  revoked: false,
}

const DEMO_VEHICLE = {
  vin_hash: sha256('1HGBH41JXMN109186'),
  plate_hash: sha256('ABC-123'),
  owner_did_hash: sha256('did:web:attestto.id:user:demo-citizen'),
  credential_type: 'VehicleRegistration',
  vc_hash: sha256('demo-vehicle-registration-vc-content-hash'),
  issued_at: BigInt(Math.floor(Date.now() / 1000)),
}

const DEMO_DATA = [
  { schemaKey: 'schema_INSTITUTION', data: DEMO_INSTITUTION, label: 'COSEVI trust anchor' },
  { schemaKey: 'schema_CREDENTIAL-ANCHOR', data: DEMO_CREDENTIAL, label: 'Demo mDL credential' },
  { schemaKey: 'schema_VEHICLE-HISTORY', data: DEMO_VEHICLE, label: 'Demo vehicle registration' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n  CR Vial Ecosystem — Demo Attestations\n')

  // Load deployment record
  const deployPath = resolve(import.meta.dirname, '..', '..', 'docs', 'deployment-devnet.json')
  const deployment = JSON.parse(readFileSync(deployPath, 'utf-8'))

  const keypairPath = process.env.SOLANA_KEYPAIR_PATH
    || `${process.env.HOME}/.config/solana/attestto-vlei.json`

  const authority = await loadKeypairSignerFromFile(keypairPath)
  const client = createSolanaClient({ urlOrMoniker: 'devnet' })

  console.log(`  Authority:  ${authority.address}`)
  console.log(`  Credential: ${deployment.credential}`)
  console.log()

  // Generate a demo "nonce" address (represents the subject of each attestation)
  const demoSubject = await generateKeyPairSigner()
  console.log(`  Demo subject: ${demoSubject.address}`)
  console.log()

  const expiryTimestamp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)

  for (const { schemaKey, data, label } of DEMO_DATA) {
    const schemaPdaAddress = deployment[schemaKey] as Address
    if (!schemaPdaAddress) {
      console.log(`  [skip] ${schemaKey} — not found in deployment record`)
      continue
    }

    console.log(`  Creating attestation: ${label}`)

    // Fetch schema from chain to serialize data correctly
    const schema = await fetchSchema(client.rpc, schemaPdaAddress)

    const [attestationPda] = await deriveAttestationPda({
      credential: deployment.credential as Address,
      schema: schemaPdaAddress,
      nonce: demoSubject.address,
    })

    const createAttestationIx = await getCreateAttestationInstruction({
      payer: authority,
      authority: authority,
      credential: deployment.credential as Address,
      schema: schemaPdaAddress,
      attestation: attestationPda,
      nonce: demoSubject.address,
      expiry: expiryTimestamp,
      data: serializeAttestationData(schema.data, data),
    })

    await sendAndConfirm(client, authority, [createAttestationIx], label)
    console.log(`       PDA: ${attestationPda}`)
    console.log()
  }

  console.log('  Done. Verify with: pnpm verify\n')
}

main().catch((err) => {
  console.error('\n  Demo failed:', err.message || err)
  process.exit(1)
})

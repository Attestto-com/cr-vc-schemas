/**
 * CR Vial Ecosystem — Verify Attestations
 *
 * Reads attestation data from the deployed schemas and verifies them.
 * This demonstrates the verification flow that an officer app or
 * third-party verifier would use.
 *
 * Usage:
 *   pnpm verify
 *   pnpm verify -- --schema INSTITUTION --nonce <address>
 */

import {
  fetchSchema,
  fetchAttestation,
  deserializeAttestationData,
  deriveAttestationPda,
} from 'sas-lib'
import {
  createSolanaClient,
  type Address,
} from 'gill'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ─────────────────────────────────────────────────────────────────────────────
// CLI Args
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2)
  let schemaName = ''
  let nonce = ''

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--schema' && args[i + 1]) {
      schemaName = args[i + 1]
      i++
    } else if (args[i] === '--nonce' && args[i + 1]) {
      nonce = args[i + 1]
      i++
    }
  }

  return { schemaName, nonce }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n  CR Vial Ecosystem — Verify Attestations\n')

  const { schemaName, nonce } = parseArgs()

  const deployPath = resolve(import.meta.dirname, '..', '..', 'docs', 'deployment-devnet.json')
  const deployment = JSON.parse(readFileSync(deployPath, 'utf-8'))

  const client = createSolanaClient({ urlOrMoniker: 'devnet' })

  // If specific schema + nonce provided, verify just that one
  if (schemaName && nonce) {
    const schemaKey = `schema_${schemaName}`
    const schemaPdaAddress = deployment[schemaKey] as Address
    if (!schemaPdaAddress) {
      console.error(`  Schema ${schemaName} not found in deployment record`)
      process.exit(1)
    }

    await verifyOne(client, deployment.credential as Address, schemaPdaAddress, nonce as Address, schemaName)
    return
  }

  // Otherwise, list all schemas and their on-chain state
  console.log('  Deployment record:')
  console.log(`    Network:    ${deployment.network}`)
  console.log(`    Authority:  ${deployment.authority}`)
  console.log(`    Credential: ${deployment.credential}`)
  console.log(`    Deployed:   ${deployment.deployedAt}`)
  console.log()

  const schemaKeys = Object.keys(deployment).filter((k) => k.startsWith('schema_'))

  for (const key of schemaKeys) {
    const name = key.replace('schema_', '')
    const pda = deployment[key] as Address

    console.log(`  Schema: ${name}`)
    console.log(`    PDA: ${pda}`)

    try {
      const schema = await fetchSchema(client.rpc, pda)
      console.log(`    Status: ${schema.data.isPaused ? 'PAUSED' : 'ACTIVE'}`)
      console.log(`    Description: ${schema.data.description}`)
    } catch {
      console.log(`    Status: NOT FOUND (may not be deployed yet)`)
    }
    console.log()
  }
}

async function verifyOne(
  client: ReturnType<typeof createSolanaClient>,
  credentialPda: Address,
  schemaPda: Address,
  nonce: Address,
  schemaName: string
) {
  console.log(`  Verifying ${schemaName} attestation for nonce: ${nonce}`)

  try {
    const schema = await fetchSchema(client.rpc, schemaPda)

    if (schema.data.isPaused) {
      console.log('  Result: INVALID — schema is paused')
      return
    }

    const [attestationPda] = await deriveAttestationPda({
      credential: credentialPda,
      schema: schemaPda,
      nonce,
    })

    const attestation = await fetchAttestation(client.rpc, attestationPda)
    const data = deserializeAttestationData(schema.data, attestation.data.data as Uint8Array)

    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))
    const isExpired = currentTimestamp >= attestation.data.expiry

    console.log(`  PDA:    ${attestationPda}`)
    console.log(`  Expiry: ${new Date(Number(attestation.data.expiry) * 1000).toISOString()}`)
    console.log(`  Status: ${isExpired ? 'EXPIRED' : 'VALID'}`)
    console.log(`  Data:`, data)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.log(`  Result: NOT FOUND — ${message}`)
  }
  console.log()
}

main().catch((err) => {
  console.error('\n  Verify failed:', err.message || err)
  process.exit(1)
})

/**
 * CR Vial Ecosystem — SAS Deployment Script
 *
 * Deploys the CR-VIAL-ECOSYSTEM credential and 3 schemas to Solana
 * via the Solana Attestation Service (SAS).
 *
 * Usage:
 *   pnpm deploy:devnet                          # uses default keypair
 *   pnpm deploy:devnet -- --keypair /path/to.json
 *   pnpm deploy:mainnet -- --keypair /path/to.json
 *
 * Authority model:
 *   - Devnet: deployer keypair (for testing/demo)
 *   - Mainnet: Attestto Open DAO vault (DjDwXJHv7rKk8quj8o8tGTu5JfUnfVqq5wk8TZC6XiAp)
 *             via Squads multisig proposal (4Uq3CB7e4wvE4Y3hPcuTnQBefYHn6CBoVAya3WSHWW5T)
 *
 * @see https://attest.solana.com/docs
 * @see https://attestto.org/.well-known/governance.json
 */

import {
  getCreateCredentialInstruction,
  getCreateSchemaInstruction,
  deriveCredentialPda,
  deriveSchemaPda,
} from 'sas-lib'
import {
  createSolanaClient,
  createTransaction,
  type Instruction,
  type TransactionSigner,
  type Blockhash,
  type Signature,
  type SolanaClient,
} from 'gill'
import { loadKeypairSignerFromFile } from 'gill/node'
import { estimateComputeUnitLimitFactory } from 'gill/programs'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { CREDENTIAL_NAME, ALL_SCHEMAS } from './schemas.js'

// ─────────────────────────────────────────────────────────────────────────────
// CLI Args
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2)
  let cluster: 'devnet' | 'mainnet' = 'devnet'
  let keypairPath = ''

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cluster' && args[i + 1]) {
      cluster = args[i + 1] as 'devnet' | 'mainnet'
      i++
    } else if (args[i] === '--keypair' && args[i + 1]) {
      keypairPath = args[i + 1]
      i++
    }
  }

  return { cluster, keypairPath }
}

// ─────────────────────────────────────────────────────────────────────────────
// TX Helper
// ─────────────────────────────────────────────────────────────────────────────

async function sendAndConfirm(
  client: SolanaClient,
  payer: TransactionSigner,
  instructions: Instruction[],
  label: string
): Promise<Signature> {
  // Estimate compute units
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
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const { cluster, keypairPath } = parseArgs()

  if (cluster === 'mainnet') {
    console.error(
      '\n  MAINNET deployment requires a Squads multisig proposal.\n' +
      '  Authority: Attestto Open DAO vault DjDwXJHv7rKk8quj8o8tGTu5JfUnfVqq5wk8TZC6XiAp\n' +
      '  Multisig:  4Uq3CB7e4wvE4Y3hPcuTnQBefYHn6CBoVAya3WSHWW5T\n\n' +
      '  This script does not yet support Squads proposal creation.\n' +
      '  Use the Squads UI at https://v4.squads.so to create a proposal.\n'
    )
    process.exit(1)
  }

  console.log(`\n  CR Vial Ecosystem — SAS Deployment`)
  console.log(`  Network:    ${cluster}`)
  console.log(`  Credential: ${CREDENTIAL_NAME}`)
  console.log(`  Schemas:    ${ALL_SCHEMAS.map((s) => s.name).join(', ')}`)
  console.log()

  // Load keypair
  const resolvedKeypairPath = keypairPath
    || process.env.SOLANA_KEYPAIR_PATH
    || `${process.env.HOME}/.config/solana/attestto-vlei.json`

  console.log(`  Keypair:    ${resolvedKeypairPath}`)

  const authority = await loadKeypairSignerFromFile(resolvedKeypairPath)
  console.log(`  Authority:  ${authority.address}`)
  console.log()

  const client = createSolanaClient({ urlOrMoniker: cluster })

  // ── Step 1: Create Credential ──────────────────────────────────────────

  console.log('1. Creating credential...')

  const [credentialPda] = await deriveCredentialPda({
    authority: authority.address,
    name: CREDENTIAL_NAME,
  })

  const createCredentialIx = getCreateCredentialInstruction({
    payer: authority,
    credential: credentialPda,
    authority: authority,
    name: CREDENTIAL_NAME,
    signers: [authority.address],
  })

  await sendAndConfirm(client, authority, [createCredentialIx], `Credential: ${CREDENTIAL_NAME}`)
  console.log(`       PDA: ${credentialPda}`)
  console.log()

  // ── Step 2: Create Schemas ─────────────────────────────────────────────

  const deploymentRecord: Record<string, string> = {
    network: cluster,
    authority: authority.address as string,
    credential: credentialPda as string,
    deployedAt: new Date().toISOString(),
  }

  for (let i = 0; i < ALL_SCHEMAS.length; i++) {
    const schema = ALL_SCHEMAS[i]
    console.log(`${i + 2}. Creating schema: ${schema.name} (v${schema.version})...`)

    const [schemaPda] = await deriveSchemaPda({
      credential: credentialPda,
      name: schema.name,
      version: schema.version,
    })

    const createSchemaIx = getCreateSchemaInstruction({
      authority: authority,
      payer: authority,
      name: schema.name,
      credential: credentialPda,
      description: schema.description,
      fieldNames: schema.fields,
      schema: schemaPda,
      layout: schema.layout,
    })

    await sendAndConfirm(client, authority, [createSchemaIx], `Schema: ${schema.name}`)
    console.log(`       PDA: ${schemaPda}`)
    console.log(`       Fields: ${schema.fields.join(', ')}`)
    console.log()

    deploymentRecord[`schema_${schema.name}`] = schemaPda as string
  }

  // ── Step 3: Write deployment record ────────────────────────────────────

  const outputPath = resolve(import.meta.dirname, '..', '..', 'docs', `deployment-${cluster}.json`)
  writeFileSync(outputPath, JSON.stringify(deploymentRecord, null, 2) + '\n')
  console.log(`  Deployment record: ${outputPath}`)

  console.log('\n  Done. All schemas deployed to SAS on', cluster)
  console.log()
  console.log('  Next steps:')
  console.log('    pnpm demo:attest    # create sample attestations')
  console.log('    pnpm verify         # verify attestations on-chain')
  console.log()
}

main().catch((err) => {
  console.error('\n  Deploy failed:', err.message || err)
  process.exit(1)
})

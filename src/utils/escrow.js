import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Account,
  PublicKey,
  Connection,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { ESCROW_ACCOUNT_DATA_LAYOUT } from './layout'

const connection = new Connection('http://localhost:8899', 'singleGossip')

/**
 * @param  {string} privateKeyByteArray
 * @param  {string} initializerXTokenAccountPubkeyString
 * @param  {number} amountXTokensToSendToEscrow
 * @param  {string} initializerReceivingTokenAccountPubkeyString
 * @param  {number} expectedAmount
 * @param  {string} escrowProgramIdString
 */
export async function initEscrow(
  privateKeyByteArray,
  initializerXTokenAccountPubkeyString,
  amountXTokensToSendToEscrow,
  initializerReceivingTokenAccountPubkeyString,
  expectedAmount,
  escrowProgramIdString,
) {
  const initializerXTokenAccountPubkey = new PublicKey(initializerXTokenAccountPubkeyString)

  //@ts-expect-error
  const XTokenMintAccountPubkey = new PublicKey(
    (await connection.getParsedAccountInfo(initializerXTokenAccountPubkey, 'singleGossip')).value.data.parsed.info.mint,
  )

  const privateKeyDecoded = privateKeyByteArray.split(',').map((s) => parseInt(s))
  const initializerAccount = new Account(privateKeyDecoded)

  const tempTokenAccount = new Account()
  const createTempTokenAccountIx = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: tempTokenAccount.publicKey,
  })
  const initTempAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    XTokenMintAccountPubkey,
    tempTokenAccount.publicKey,
    initializerAccount.publicKey,
  )
  const transferXTokensToTempAccIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    initializerXTokenAccountPubkey,
    tempTokenAccount.publicKey,
    initializerAccount.publicKey,
    [],
    amountXTokensToSendToEscrow,
  )

  const escrowAccount = new Account()
  const escrowProgramId = new PublicKey(escrowProgramIdString)

  const createEscrowAccountIx = SystemProgram.createAccount({
    space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
    lamports: await connection.getMinimumBalanceForRentExemption(ESCROW_ACCOUNT_DATA_LAYOUT.span, 'singleGossip'),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: escrowAccount.publicKey,
    programId: escrowProgramId,
  })

  const initEscrowIx = new TransactionInstruction({
    programId: escrowProgramId,
    keys: [
      { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
      { pubkey: tempTokenAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(initializerReceivingTokenAccountPubkeyString), isSigner: false, isWritable: false },
      { pubkey: escrowAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(0, ...new BN(expectedAmount).toArray('le', 8))),
  })

  const tx = new Transaction().add(
    createTempTokenAccountIx,
    initTempAccountIx,
    transferXTokensToTempAccIx,
    createEscrowAccountIx,
    initEscrowIx,
  )
  await connection.sendTransaction(tx, [initializerAccount, tempTokenAccount, escrowAccount], {
    skipPreflight: false,
    preflightCommitment: 'singleGossip',
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const encodedEscrowState = (await connection.getAccountInfo(escrowAccount.publicKey, 'singleGossip')).data
  const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState)
  return {
    escrowAccountPubkey: escrowAccount.publicKey.toBase58(),
    isInitialized: !!decodedEscrowState.isInitialized,
    initializerAccountPubkey: new PublicKey(decodedEscrowState.initializerPubkey).toBase58(),
    XTokenTempAccountPubkey: new PublicKey(decodedEscrowState.initializerTempTokenAccountPubkey).toBase58(),
    initializerYTokenAccount: new PublicKey(decodedEscrowState.initializerReceivingTokenAccountPubkey).toBase58(),
    expectedAmount: new BN(decodedEscrowState.expectedAmount, 10, 'le').toNumber(),
  }
}

/**
 * @param  {string} privateKeyByteArray
 * @param  {string} escrowAccountAddressString
 * @param  {string} takerXTokenAccountAddressString
 * @param  {string} takerYTokenAccountAddressString
 * @param  {number} takerExpectedXTokenAmount
 * @param  {string} programIdString
 */
export const takeTrade = async (
  privateKeyByteArray,
  escrowAccountAddressString,
  takerXTokenAccountAddressString,
  takerYTokenAccountAddressString,
  takerExpectedXTokenAmount,
  programIdString,
) => {
  const takerAccount = new Account(privateKeyByteArray.split(',').map((s) => parseInt(s)))
  const escrowAccountPubkey = new PublicKey(escrowAccountAddressString)
  const takerXTokenAccountPubkey = new PublicKey(takerXTokenAccountAddressString)
  const takerYTokenAccountPubkey = new PublicKey(takerYTokenAccountAddressString)
  const programId = new PublicKey(programIdString)

  let encodedEscrowState
  try {
    encodedEscrowState = (await connection.getAccountInfo(escrowAccountPubkey, 'singleGossip')).data
  } catch (err) {
    throw new Error('Could not find escrow at given address!')
  }
  const decodedEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState)
  const escrowState = {
    escrowAccountPubkey: escrowAccountPubkey,
    isInitialized: !!decodedEscrowLayout.isInitialized,
    initializerAccountPubkey: new PublicKey(decodedEscrowLayout.initializerPubkey),
    XTokenTempAccountPubkey: new PublicKey(decodedEscrowLayout.initializerTempTokenAccountPubkey),
    initializerYTokenAccount: new PublicKey(decodedEscrowLayout.initializerReceivingTokenAccountPubkey),
    expectedAmount: new BN(decodedEscrowLayout.expectedAmount, 10, 'le'),
  }

  const PDA = await PublicKey.findProgramAddress([Buffer.from('escrow')], programId)

  const exchangeInstruction = new TransactionInstruction({
    programId,
    data: Buffer.from(Uint8Array.of(1, ...new BN(takerExpectedXTokenAmount).toArray('le', 8))),
    keys: [
      { pubkey: takerAccount.publicKey, isSigner: true, isWritable: false },
      { pubkey: takerYTokenAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: takerXTokenAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: escrowState.XTokenTempAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: escrowState.initializerAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: escrowState.initializerYTokenAccount, isSigner: false, isWritable: true },
      { pubkey: escrowAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: PDA[0], isSigner: false, isWritable: false },
    ],
  })

  await connection.sendTransaction(new Transaction().add(exchangeInstruction), [takerAccount], {
    skipPreflight: false,
    preflightCommitment: 'singleGossip',
  })
}

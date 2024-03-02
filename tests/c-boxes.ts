import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { createTree, mintV1, mplBubblegum, parseLeafFromMintV1Transaction, fetchMerkleTree, getMerkleRoot, getMerkleProof, LeafSchema, MerkleTree, MPL_BUBBLEGUM_PROGRAM_ID, SPL_ACCOUNT_COMPRESSION_PROGRAM_ID } from '@metaplex-foundation/mpl-bubblegum';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { CBoxes } from "../target/types/c_boxes";
import { generateSigner, none } from "@metaplex-foundation/umi";
import chai, { expect } from "chai";

describe("c-boxes", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.CBoxes as Program<CBoxes>;
  const umi = createUmi(provider.connection.rpcEndpoint, { commitment: 'confirmed' })
  .use(walletAdapterIdentity(provider.wallet))
  .use(mplBubblegum());
  const merkleTree = generateSigner(umi)

  let treeDetails: MerkleTree
  let nftLeaf: LeafSchema

  before("Create a tree and mint 1 CNFT", async () => {

    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: 14,
      maxBufferSize: 64
    })
    await builder.sendAndConfirm(umi)
    treeDetails = await fetchMerkleTree(umi, merkleTree.publicKey)

    const { signature } = await mintV1(
      umi,
      {
          leafOwner: umi.payer.publicKey,
          merkleTree: merkleTree.publicKey,
          metadata: {
              name: `MadLad #1`,
              uri: `https://madlads.s3.us-west-2.amazonaws.com/json/1.json`,
              sellerFeeBasisPoints: 420,
              collection: none(),
              creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }]
          }
      }
    ).sendAndConfirm(umi)

    nftLeaf = await parseLeafFromMintV1Transaction(umi, signature)
  })

  it("Execute SOL transfer tx as cnft owner!", async () => {
    const boxSigner = anchor.web3.PublicKey.findProgramAddressSync(
      [new anchor.web3.PublicKey(nftLeaf.id).toBuffer()],
      program.programId
    )[0]

    const amount = 1 * anchor.web3.LAMPORTS_PER_SOL

    await provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: boxSigner,
          lamports: amount
        })
      )
    )

    await provider.connection.getBalance(boxSigner)
    .then(b => {
      expect(b).eq(amount)
    })

    const transferIx = anchor.web3.SystemProgram.transfer({
      fromPubkey: boxSigner,
      toPubkey: provider.publicKey,
      lamports: amount
    })

    const leaves = treeDetails.canopy
    const boxRoot = getMerkleRoot(leaves, 14)
    const proofPath = getMerkleProof(leaves, 14, nftLeaf.id).map((node: string) => ({
        pubkey: new anchor.web3.PublicKey(node),
        isSigner: false,
        isWritable: false,
    }));

    await program.methods
    .execute({
      boxDataHash: [...nftLeaf.dataHash],
      boxCreatorHash: [...nftLeaf.creatorHash],
      boxIndex: 0,
      boxNonce: new anchor.BN(nftLeaf.nonce.toString()),
      boxProofsLength: proofPath.length,
      boxRoot: [...new anchor.web3.PublicKey(boxRoot).toBytes()],
      ixData: transferIx.data
    })
    .accounts({
      boxMerkleTree: merkleTree.publicKey,
      boxOwner: provider.publicKey,
      boxSigner,
      mplBubblegum: MPL_BUBBLEGUM_PROGRAM_ID,
      splAccountCompression: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      targetProgram: transferIx.programId
    })
    .remainingAccounts([...proofPath, ...transferIx.keys.map(k => ({ ...k, isSigner: false }))])
    .rpc()

    await provider.connection.getBalance(boxSigner)
    .then(b => {
      expect(b).eq(0)
    })
  });

  it("Try init boxSigner as another program account (must fail)", async () => {
    const boxSigner = anchor.web3.PublicKey.findProgramAddressSync(
      [new anchor.web3.PublicKey(nftLeaf.id).toBuffer()],
      program.programId
    )[0]

    const initIx = anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.publicKey,
      lamports: 1_000_000,
      newAccountPubkey: boxSigner,
      programId: new anchor.web3.PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
      space: 0
    })

    const leaves = treeDetails.canopy
    const boxRoot = getMerkleRoot(leaves, 14)
    const proofPath = getMerkleProof(leaves, 14, nftLeaf.id).map((node: string) => ({
        pubkey: new anchor.web3.PublicKey(node),
        isSigner: false,
        isWritable: false,
    }));

    let err: anchor.AnchorError

    await program.methods
    .execute({
      boxDataHash: [...nftLeaf.dataHash],
      boxCreatorHash: [...nftLeaf.creatorHash],
      boxIndex: 0,
      boxNonce: new anchor.BN(nftLeaf.nonce.toString()),
      boxProofsLength: proofPath.length,
      boxRoot: [...new anchor.web3.PublicKey(boxRoot).toBytes()],
      ixData: initIx.data
    })
    .accounts({
      boxMerkleTree: merkleTree.publicKey,
      boxOwner: provider.publicKey,
      boxSigner,
      mplBubblegum: MPL_BUBBLEGUM_PROGRAM_ID,
      splAccountCompression: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      targetProgram: initIx.programId
    })
    .remainingAccounts([...proofPath, ...initIx.keys.map(k => ({ ...k, isSigner: false }))])
    .rpc()
    .catch(e => err = e)
    
    expect(err).exist
    expect(err.error.errorCode.number).eq(6000)

    await provider.connection.getAccountInfo(boxSigner)
    .then(a => {
      expect(a).eq(null)
    })
  });
});

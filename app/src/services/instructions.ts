import { BN, web3 } from "@coral-xyz/anchor";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { AssetWithProof, MPL_BUBBLEGUM_PROGRAM_ID, SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, transfer } from "@metaplex-foundation/mpl-bubblegum";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchNftById, umi } from ".";
import { program } from "../constants";
import { deriveBoxSigner } from "../utils";


export async function createWithdrawCNftInstruction (boxAsset: AssetWithProof, signer: web3.PublicKey, withdrawAsset: DasApiAsset) {

    const withdrawAssetWithProof = await fetchNftById(withdrawAsset.id)

    const transferIx = transfer(umi, {
        ...withdrawAssetWithProof,
        newLeafOwner: publicKey(signer.toString())
    }).getInstructions()[0]

    const proofPath = boxAsset.proof.map((node: string) => ({
        pubkey: new web3.PublicKey(node),
        isSigner: false,
        isWritable: false,
    }));

    const ix = await program.methods.execute({
        boxCreatorHash: [...boxAsset.creatorHash],
        boxDataHash: [...boxAsset.dataHash],
        boxIndex: boxAsset.index,
        boxNonce: new BN(boxAsset.nonce),
        boxProofsLength: proofPath.length,
        boxRoot: [...boxAsset.root],
        ixData: Buffer.from(transferIx.data)
    })
    .accounts({
        boxMerkleTree: new web3.PublicKey(boxAsset.merkleTree),
        boxOwner: signer,
        boxSigner: deriveBoxSigner(boxAsset.rpcAsset.id),
        mplBubblegum: MPL_BUBBLEGUM_PROGRAM_ID,
        splAccountCompression: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        targetProgram: MPL_BUBBLEGUM_PROGRAM_ID
    })
    .remainingAccounts(
        [...proofPath, ...transferIx.keys.map(k => ({ pubkey: new web3.PublicKey(k.pubkey), isSigner: false, isWritable: k.isWritable }))]
    )
    .instruction()

    return ix
}


export async function createWithdrawSolInstruction (boxAsset: AssetWithProof, signer: web3.PublicKey, amount: number) {

    const boxSigner = deriveBoxSigner(boxAsset.rpcAsset.id)

    const transferIx = web3.SystemProgram.transfer({
        fromPubkey: boxSigner,
        toPubkey: new web3.PublicKey('121LMgNHbfq4q7YoFeiUWQ5m6R1iCXDz4R5KKPsLHeKM'),
        lamports: amount
    })

    const proofPath = boxAsset.proof.map((node: string) => ({
        pubkey: new web3.PublicKey(node),
        isSigner: false,
        isWritable: false,
    }));

    const ix = await program.methods.execute({
        boxCreatorHash: [...boxAsset.creatorHash],
        boxDataHash: [...boxAsset.dataHash],
        boxIndex: boxAsset.index,
        boxNonce: new BN(boxAsset.nonce),
        boxProofsLength: proofPath.length,
        boxRoot: [...boxAsset.root],
        ixData: Buffer.from(transferIx.data)
    })
    .accounts({
        boxMerkleTree: new web3.PublicKey(boxAsset.merkleTree),
        boxOwner: signer,
        boxSigner,
        mplBubblegum: MPL_BUBBLEGUM_PROGRAM_ID,
        splAccountCompression: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        targetProgram: web3.SystemProgram.programId
    })
    .remainingAccounts(
        [...proofPath, ...transferIx.keys.map(k => ({ ...k, isSigner: false }))]
    )
    .instruction()

    return ix
}
import { AccountMeta, TransactionInstruction, PublicKey } from "@solana/web3.js";
import { MPL_BUBBLEGUM_PROGRAM_ID, PROGRAM_ID, SPL_ACCOUNT_COMPRESSION_PROGRAM_ID } from "./constants";
import { deriveBoxSigner, deriveCNftId } from "./derivations";

const EXECUTE_IX_DISCRIMINATOR = [130, 221, 242, 154, 13, 193, 189, 29]

type CNftWithProof = {
    creatorHash: Uint8Array;
    dataHash: Uint8Array;
    index: number;
    nonce: number;
    root: Uint8Array;
    proof: PublicKey[];
}

type CreateExecuteInstructionInput = {
    instructionToExecute: TransactionInstruction;
    cnft: CNftWithProof;
    merkleTree: PublicKey;
    owner: PublicKey;
}

export function createExecuteInstruction ({
    cnft, instructionToExecute, merkleTree, owner
}: CreateExecuteInstructionInput): TransactionInstruction {

    const boxNonce = Buffer.alloc(8)
    boxNonce.writeUInt32LE(cnft.nonce >> 8, 4)
    boxNonce.writeUint32LE(cnft.nonce & 0x00ff, 0)
    const boxIndex = Buffer.alloc(4)
    boxIndex.writeUint32LE(cnft.index)
    const boxProofsLength = Buffer.alloc(1)
    boxProofsLength.writeInt8(cnft.proof.length)

    const ixToExecuteLength = Buffer.alloc(4)
    ixToExecuteLength.writeUint32LE(instructionToExecute.data.length)

    const data = Buffer.concat([
        Buffer.from(EXECUTE_IX_DISCRIMINATOR),
        Buffer.from(cnft.root),
        Buffer.from(cnft.dataHash),
        Buffer.from(cnft.creatorHash),
        boxNonce,
        boxIndex,
        boxProofsLength,
        ixToExecuteLength,
        instructionToExecute.data
    ])

    const boxSigner = deriveBoxSigner(deriveCNftId(merkleTree, cnft.nonce))

    const keys: AccountMeta[] = [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: merkleTree, isSigner: false, isWritable: false },
        { pubkey: boxSigner, isSigner: false, isWritable: false },
        { pubkey: MPL_BUBBLEGUM_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: instructionToExecute.programId, isSigner: false, isWritable: false },
        ...cnft.proof.map(pubkey => ({ pubkey, isSigner: false, isWritable: false })),
        ...instructionToExecute.keys.map(meta => meta.pubkey.equals(boxSigner) ? { ...meta, isSigner: false } : meta)
    ]

    return {
        keys,
        data,
        programId: PROGRAM_ID
    }
}
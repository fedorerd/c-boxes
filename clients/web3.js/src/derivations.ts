import { PublicKey } from "@solana/web3.js"
import { MPL_BUBBLEGUM_PROGRAM_ID, PROGRAM_ID } from "./constants"

export function deriveBoxSigner (id: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(id).toBuffer()],
        PROGRAM_ID
    )[0]
}

export function deriveCNftId (tree: PublicKey, nonce: number) {
    const boxNonce = Buffer.alloc(8)
    boxNonce.writeBigInt64LE(BigInt(nonce), 0)
    return PublicKey.findProgramAddressSync(
        [Buffer.from("asset"), tree.toBuffer(), boxNonce],
        MPL_BUBBLEGUM_PROGRAM_ID
    )[0]
}
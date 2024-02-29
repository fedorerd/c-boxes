import { web3 } from "@coral-xyz/anchor";
import { programId } from "../constants";

export function deriveBoxSigner (id: string) {
    return web3.PublicKey.findProgramAddressSync(
        [new web3.PublicKey(id).toBuffer()],
        programId
    )[0]
}

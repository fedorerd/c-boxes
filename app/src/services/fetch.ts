import { getAssetWithProof } from "@metaplex-foundation/mpl-bubblegum"
import { umi } from "."
import { publicKey } from "@metaplex-foundation/umi"


export async function fetchNftById (id: string) {
    return getAssetWithProof(umi, publicKey(id))
}

export async function fetchNftsByOwner (address: string) {
    return umi.rpc.getAssetsByOwner({ owner: publicKey(address) })
}

export async function fetchSolBalance (address: string) {
    return umi.rpc.getBalance(publicKey(address))
}
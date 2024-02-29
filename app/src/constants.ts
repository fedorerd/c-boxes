import { Program, web3 } from "@coral-xyz/anchor"
import { CBoxes, IDL } from "./c_boxes"

export const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://api.devnet.solana.com/'
export const programId = new web3.PublicKey('CBoxNpgGfdEjBNdtGE9WrvZWevadyzviGz7anY2fxm6M')
export const connection = new web3.Connection(rpcUrl)
export const program = new Program<CBoxes>(IDL, programId, { connection })
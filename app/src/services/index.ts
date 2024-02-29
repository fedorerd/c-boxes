import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { rpcUrl } from '../constants'

export const umi = createUmi(rpcUrl).use(mplBubblegum()).use(dasApi())

export * from './fetch'
export * from './instructions'
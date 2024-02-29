import useSWR from "swr"
import { ApiDataCacheRoutes } from "."
import { fetchSolBalance } from "../../services"


export type UseSolBalanceDataProps = [address: string]

export function useSolBalanceData (...[address]: UseSolBalanceDataProps) {
    return useSWR(
        address ? [ApiDataCacheRoutes.GetSolBalance, address] : null,
        ([_, address]) => fetchSolBalance(address)
    )
}
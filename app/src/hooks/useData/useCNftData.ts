import useSWR from "swr"
import { ApiDataCacheRoutes } from "."
import { fetchNftById, fetchNftsByOwner } from "../../services"


export type UseCNftDataProps = [id: string]

export function useCNftData (...[id]: UseCNftDataProps) {
    return useSWR(
        id ? [ApiDataCacheRoutes.GetCNftById, id] : null,
        ([_, id]) => fetchNftById(id)
    )
}

export type UseNftsByOwnerDataProps = [owner: string | null]

export function useNftsByOwnerData (...[owner]: UseNftsByOwnerDataProps) {
    return useSWR(
        owner ? [ApiDataCacheRoutes.GetCNftById, owner] : null,
        ([_, owner]) => fetchNftsByOwner(owner)
    )
}
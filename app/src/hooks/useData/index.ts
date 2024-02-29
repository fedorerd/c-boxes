import { useSolBalanceData, UseSolBalanceDataProps } from './useBalancesData';
import { useCNftData, UseCNftDataProps, useNftsByOwnerData, UseNftsByOwnerDataProps } from './useCNftData';

export enum ApiDataCacheRoutes {
    GetCNftById = 'get/cnft/byid',
    GetSolBalance= 'get/balance/sol',
    GetNftsByOwner = 'get/nfts/by-owner'
}

export type UseDataTypesMap = {
    [ApiDataCacheRoutes.GetCNftById]: [UseCNftDataProps, ReturnType<typeof useCNftData>],
    [ApiDataCacheRoutes.GetNftsByOwner]: [UseNftsByOwnerDataProps, ReturnType<typeof useNftsByOwnerData>],
    [ApiDataCacheRoutes.GetSolBalance]: [UseSolBalanceDataProps, ReturnType<typeof useSolBalanceData>]
}
  
export type UseDataParams<K extends ApiDataCacheRoutes> = K extends keyof UseDataTypesMap ? UseDataTypesMap[K][0] : [];
export type UseDataReturnType<K extends ApiDataCacheRoutes> = K extends keyof UseDataTypesMap ? UseDataTypesMap[K][1] : null;  

export function useData<
    K extends ApiDataCacheRoutes
> (
    key: K,
    ...params: UseDataParams<K>
): UseDataReturnType<K> {
    switch (key) {
        case ApiDataCacheRoutes.GetCNftById:
            return useCNftData(...params as UseCNftDataProps) as UseDataReturnType<K>;
        case ApiDataCacheRoutes.GetSolBalance:
            return useSolBalanceData(...params as UseSolBalanceDataProps) as UseDataReturnType<K>;
        case ApiDataCacheRoutes.GetNftsByOwner:
            return useNftsByOwnerData(...params as UseNftsByOwnerDataProps) as UseDataReturnType<K>;
        default:
            return null as UseDataReturnType<K>;
    }      
}
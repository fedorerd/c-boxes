import { CircularProgress, Stack } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { ApiDataCacheRoutes, useData } from "../../hooks";
import { BoxAssets, BoxBalances, CNftCard, NotFound } from "./components";
import { GoHome } from "./components/GoHome";

export const CBox: FC = () => {

    const { id } = useParams()

    const { isLoading, data, error } = useData(ApiDataCacheRoutes.GetCNftById, id || '')

    if (isLoading) return (
        <CircularProgress/>
    )

    if (error || !data) return (
        <NotFound message="cNFT not found"/>
    )

    if (data && !data.rpcAsset.compression.compressed) return (
        <NotFound message="Not a cNFT"/>
    )

    return (
        <Stack
        direction={{ sm: 'column' }}
        alignSelf="center"
        spacing={3}
        useFlexGap
        sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
        >
        <GoHome/>
        <CNftCard/>
        <BoxBalances/>
        <BoxAssets/>
        </Stack>
    )
}
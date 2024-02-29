import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiDataCacheRoutes, useData } from "../../../hooks";
import { deriveBoxSigner } from "../../../utils";
import { web3 } from "@coral-xyz/anchor";

export const CNftCard: FC = () => {

    const { id } = useParams()

    const { data, mutate } = useData(ApiDataCacheRoutes.GetCNftById, id || '')
    const boxSigner = deriveBoxSigner(id || web3.PublicKey.default.toString()).toString()

    if (!data) return null

    return (
        <Card
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CardContent
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
                    {data.metadata.name}
                </Typography>
                <CardMedia
                    sx={{
                        marginBottom: '12px'
                    }}
                    component="img"
                    height="300"
                    image={
                        data.rpcAsset.content.links && "image" in data.rpcAsset.content.links && typeof data.rpcAsset.content.links.image === 'string' ?
                        data.rpcAsset.content.links.image : ''
                    }
                    alt={data.metadata.name}
                />
                <Typography variant="body1" component="div">
                    {boxSigner}
                </Typography>
                <Typography sx={{ mb: 1.5, fontSize: 12 }} color="text.secondary">
                    Box Address
                </Typography>
                <Typography variant="body1" component="div">
                    {data.rpcAsset.ownership.owner.toString()}
                </Typography>
                <Typography sx={{ mb: 1.5, fontSize: 12 }} color="text.secondary">
                    cNft Owner
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => navigator.clipboard.writeText(boxSigner)}>Copy box address</Button>
                <Link to={`https://solscan.io/account/${boxSigner}?cluster=devnet`} target="_blank">
                    <Button size="small">View box on solscan</Button>
                </Link>
                <Button size="small" onClick={() => mutate()}>Refresh</Button>
            </CardActions>
        </Card>
    )   
}
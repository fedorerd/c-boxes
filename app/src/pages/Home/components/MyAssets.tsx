import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ApiDataCacheRoutes, useData } from "../../../hooks";

export const MyAssets: FC = () => {

    const { publicKey } = useWallet()
    const { isLoading, data, mutate } = useData(ApiDataCacheRoutes.GetNftsByOwner, publicKey?.toString() || null)

    if (!publicKey) return null
    if (isLoading) return <CircularProgress/>

    return (
        <Card
        sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        }}>
            <CardContent
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                    Your assets
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => mutate()}>Refresh</Button>
            </CardActions>
            <CardContent
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px'
            }}>
                {data?.items.filter(i => i.compression.compressed).map(i => (
                    <Link to={`/cbox/${i.id}`}>
                    <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        padding: '8px'
                    }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {i.content.metadata.name}
                        </Typography>
                        <CardMedia
                            component="img"
                            height="100"
                            image={
                                i.content.links && "image" in i.content.links && typeof i.content.links.image === 'string' ?
                                i.content.links.image : ''
                            }
                        />
                    </Card>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
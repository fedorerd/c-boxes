import { web3 } from "@coral-xyz/anchor";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { ApiDataCacheRoutes, useData } from "../../../hooks";
import { deriveBoxSigner } from "../../../utils";
import { useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useAlerts } from "../../../providers";
import { createWithdrawCNftInstruction } from "../../../services";
import { connection } from "../../../constants";

export const BoxAssets: FC = () => {

    const { id } = useParams()

    const { publicKey, signTransaction } = useWallet()
    const boxSigner = deriveBoxSigner(id || web3.PublicKey.default.toString()).toString()
    const { data: boxCNft } = useData(ApiDataCacheRoutes.GetCNftById, id || '')
    const { isLoading, data, mutate } = useData(ApiDataCacheRoutes.GetNftsByOwner, boxSigner)

    const { sendAlert, removeAlert } = useAlerts()

    const onWithdraw = async (asset: DasApiAsset) => {
        if (!publicKey || !signTransaction || !boxCNft) return
        let currentAlertId = 0

        try {
            currentAlertId = sendAlert({
                type: "info",
                message: "Preparing transaction...",
                withLoader: true,
                infinite: true
            })
    
            const ix = await createWithdrawCNftInstruction(boxCNft, publicKey, asset)
            const tx = new web3.Transaction().add(ix)
            const { blockhash } = await connection.getLatestBlockhash()
            tx.recentBlockhash = blockhash
            tx.feePayer = publicKey
    
            removeAlert(currentAlertId)
            currentAlertId = sendAlert({
                type: "info",
                message: "Please, sign transaction.",
                withLoader: true,
                infinite: true
            })
    
            const signed = await signTransaction(tx)
            .catch(() => {
                throw new Error(`You didn't sign transaction.`)
            })
    
            removeAlert(currentAlertId)
            currentAlertId = sendAlert({
                type: "info",
                message: "Confirming transaction...",
                withLoader: true,
                infinite: true
            })

            const sig = await connection.sendRawTransaction(signed.serialize())
            .catch(() => {
                throw new Error('Failed to send transaction')
            })

            await connection.confirmTransaction(sig, "confirmed")
            .catch(() => {
                throw new Error('Failed to confirm transaction')
            })

            removeAlert(currentAlertId)
            sendAlert({
                type: "success",
                message: 'Asset withdrawn successfully',
                buttonLink: `https://solscan.io/tx/${sig}?cluster=devnet`,
                buttonLinkLabel: 'View tx on solscan',
            })

        } catch (e) {
            removeAlert(currentAlertId)
            sendAlert({
                type: "error",
                message: (e as any)?.message || 'Something went wrong'
            })
        }
        
    }

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
                    Box Assets
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => mutate()}>Refresh</Button>
            </CardActions>
            <CardContent
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px'
            }}>
                {data?.items.map(i => (
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
                        {
                            publicKey && boxCNft && publicKey.toString() === boxCNft.leafOwner
                            ?
                            <CardActions>
                                <Button size="small" onClick={() => onWithdraw(i)}>Withdraw</Button>
                            </CardActions>
                            : null
                        }
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
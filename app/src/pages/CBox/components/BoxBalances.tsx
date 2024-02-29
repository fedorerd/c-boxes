import { web3 } from "@coral-xyz/anchor";
import { Button, Card, CardActions, CardContent, CircularProgress, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { connection } from "../../../constants";
import { ApiDataCacheRoutes, useData } from "../../../hooks";
import { useAlerts } from "../../../providers";
import { createWithdrawSolInstruction } from "../../../services";
import { deriveBoxSigner } from "../../../utils";

export const BoxBalances: FC = () => {
    const { id } = useParams()

    const boxSigner = deriveBoxSigner(id || web3.PublicKey.default.toString()).toString()
    const { isLoading, data, mutate } = useData(ApiDataCacheRoutes.GetSolBalance, boxSigner)
    const { publicKey, signTransaction } = useWallet()
    const { data: boxCNft } = useData(ApiDataCacheRoutes.GetCNftById, id || '')

    const { sendAlert, removeAlert } = useAlerts()

    const onWithdraw = async () => {
        if (!publicKey || !signTransaction || !boxCNft || !data) return
        let currentAlertId = 0

        try {
            currentAlertId = sendAlert({
                type: "info",
                message: "Preparing transaction...",
                withLoader: true,
                infinite: true
            })
    
            const ix = await createWithdrawSolInstruction(boxCNft, publicKey, Number(data.basisPoints))
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
                message: 'Sol withdrawn successfully',
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
                    Box Balances
                </Typography>
                <Typography variant="body1" component="div">
                    {data ? `${Math.floor(Number(data.basisPoints) / Math.pow(10, data.decimals) * 1000) / 1000}` : '0'}
                </Typography>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                    {data ? `$${data.identifier}` : '$SOL'}
                </Typography>
                {
                    publicKey && boxCNft && publicKey.toString() === boxCNft.leafOwner
                    ?
                    <CardActions>
                        <Button size="small" onClick={() => onWithdraw()}>Withdraw</Button>
                    </CardActions>
                    : null
                }
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => mutate()}>Refresh</Button>
            </CardActions>
        </Card>
    )   
}
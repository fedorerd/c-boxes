import { Alert, Button, CircularProgress, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


export interface AlertPopupProps extends AlertPopupBaseWithId {
    remove: (id: number) => void
}

export interface AlertPopupBaseWithId extends AlertPopupBase {
    id: number
}

export type AlertPopupBase = {
    type: "error" | "warning" | "info" | "success",
    message: string,
    infinite?: boolean,
    buttonLinkLabel?: string,
    buttonLink?: string,
    withLoader?: boolean
}

export const AlertPopup: FC<AlertPopupProps> = ({
    message, type, id, remove, buttonLink, buttonLinkLabel, withLoader, infinite
}) => {

    const [expirationTime, setExpirationTime] = useState<number>(100)
    const [intervalID, setIntervalID] = useState<number>(0)

    const startTimer = () => {
        let interval = window.setInterval(() => {
            setExpirationTime(prev => {
                if (prev > 0) return prev - 20

                clearInterval(interval)
                return prev
            })
        }, 3000)

        setIntervalID(interval)
    }

    const pauseTimer = () => {
        window.clearInterval(intervalID)
    }

    const closeNotification = () => {
        pauseTimer()
        remove(id)
    }

    useEffect(() => {
        if (expirationTime === 0) closeNotification()
    }, [expirationTime])

    useEffect(() => {
        if (!infinite) startTimer()
    }, [])

    
    return (
        <Alert variant='outlined' severity={type}>
            {
                withLoader
                ?
                <CircularProgress size={16} sx={{ marginRight: '12px' }}/>
                :
                null
            }
            <Typography variant="body1" component="div">
                {message}
            </Typography>
            {
                buttonLink && buttonLinkLabel
                ?
                <Link to={buttonLink} target="_blank">
                    <Button sx={{ marginLeft: '12px' }} size="small">{buttonLinkLabel}</Button>
                </Link>
                :
                null
            }
        </Alert>

    )
}
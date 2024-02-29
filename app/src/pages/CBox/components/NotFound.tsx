import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { GoHome } from "./GoHome";

type Props = {
    message: string
}

export const NotFound: FC<Props> = ({ message }) => {

    return (
        <Stack
        direction={{ sm: 'column' }}
        alignSelf="center"
        spacing={1}
        useFlexGap
        sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
        >
        <Typography component="p" variant="body2">
            {message}
        </Typography>
        <GoHome/>
        </Stack>
    )
}
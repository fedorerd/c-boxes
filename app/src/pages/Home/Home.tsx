import { FC } from "react";
import { Input, MyAssets } from "./components";
import { Stack } from "@mui/material";

export const Home: FC = () => {

    return (
        <Stack
        direction={{ sm: 'column' }}
        alignSelf="center"
        spacing={3}
        useFlexGap
        sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
        >
            <Input/>
            <MyAssets/>
        </Stack>
    )
}
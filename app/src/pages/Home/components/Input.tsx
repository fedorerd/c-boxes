import { Button, Stack, TextField } from "@mui/material";
import { ElementRef, FC, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Input: FC = () => {

    const ref = useRef<ElementRef<'input'>>(null)
    const nav = useNavigate()
    const onSearch = () => {
        if (!ref.current) return
        nav(`/cbox/${ref.current.value}`)
    }

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={2}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
        >
            <TextField
            id="outlined-basic"
            hiddenLabel
            size="small"
            variant="outlined"
            aria-label="Find cNFT by ID"
            placeholder="Find cNFT by ID"
            inputProps={{
                autocomplete: 'off',
                ariaLabel: 'Find cNFT by ID',
            }}
            inputRef={ref}
            />
            <Button variant="contained" color="primary" onClick={onSearch}>
            Search
            </Button>
        </Stack>
    )
}
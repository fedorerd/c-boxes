import { AppBar, Container } from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";

export const Navbar: FC = () => {

    return (
        <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
          width: 'max-content'
        }}
        >
        <Container maxWidth="lg">
            <WalletMultiButton/>
        </Container>
        </AppBar>
    )
}
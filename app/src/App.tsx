import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css'

import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import getTheme from './Theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AlertsConsumer, AlertsProvider } from './providers';

function App() {
  const endpoint = import.meta.env.VITE_RPC_URL || 'https://api.devnet.solana.com/'

  const theme = createTheme(getTheme())

  return (
    <BrowserRouter>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <ThemeProvider theme={theme}>
              <AlertsProvider>
                <CssBaseline/>
                <AlertsConsumer/>
                <AppRouter/>
              </AlertsProvider>
            </ThemeProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  )
}

export default App

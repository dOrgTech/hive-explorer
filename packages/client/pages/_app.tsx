import type { AppProps } from 'next/app'
import '@/styles/globals.scss'
import '@rainbow-me/rainbowkit/styles.css';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';

const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    apiProvider.alchemy(process.env.ALCHEMY_ID),
    apiProvider.fallback()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'HIVE',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const App = (props: AppProps) => {
  const { Component, pageProps } = props
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: "#6B21A8",
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

export default App

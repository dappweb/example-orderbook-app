import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chiliz, gnosis, polygon } from 'viem/chains'
import { http } from 'wagmi'

const { wallets } = getDefaultWallets()

const chains = [polygon, gnosis, chiliz] as const

const wagmiConfig = getDefaultConfig({
  appName: 'Azuro',
  projectId: '2f82a1608c73932cfc64ff51aa38a87b', // get your own project ID - https://cloud.walletconnect.com/sign-in
  wallets,
  chains,
  transports: {
    [polygon.id]: http('https://polygon-bor-rpc.publicnode.com'),
    [gnosis.id]: http('https://gnosis-rpc.publicnode.com'),
    [chiliz.id]: http('https://chiliz-rpc.publicnode.com'),
  },
  ssr: false,
})

export default wagmiConfig

import { ConfigService } from '@nestjs/config'
import { Provider } from 'src/_constants/providers'
import { Env } from 'src/_constants/env'
import { ethers } from 'ethers'

export const ethereumRPCProvider = [
  {
    provide: Provider.EthersProvider,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const EthereumNodeEndpoint = config.get<string>(Env.EthereumNodeEndpoint)
      return new ethers.providers.StaticJsonRpcProvider(EthereumNodeEndpoint, {
        name: 'Ethereum',
        chainId: 1
      })
    }
  }
]

import { ConfigService } from '@nestjs/config'
import { Provider } from 'src/_constants/providers'
import { Env } from 'src/_constants/env'
import { ethers } from 'ethers'
import AWSHttpProvider from '@aws/web3-http-provider'

export const ethereumRPCProvider = [
  {
    provide: Provider.EthersProvider,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const EthereumNodeEndpoint = config.get<string>(Env.EthereumNodeEndpoint)
      if (false) {
        return new ethers.providers.StaticJsonRpcProvider(EthereumNodeEndpoint, {
          name: 'Ethereum',
          chainId: 1
        })
      }
      else {
        const accessKeyId = config.get<string>(Env.AWSAccessKeyId)
        const secretAccessKey = config.get<string>(Env.AWSSecretAccessKey)
        const baseProvider = new AWSHttpProvider(EthereumNodeEndpoint, {
          accessKeyId,
          secretAccessKey
        })
        return new ethers.providers.Web3Provider(baseProvider)
      }
    }
  }
]

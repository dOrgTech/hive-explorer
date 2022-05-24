import { Module } from '@nestjs/common'
import { ethereumRPCProvider } from 'src/ethereum-rpc/ethereum-rpc.provider'

@Module({
  providers: ethereumRPCProvider,
  exports: ethereumRPCProvider
})
export class EthereumRPCModule {}

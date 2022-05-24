import { Module } from '@nestjs/common'
import { EthereumService } from 'src/ethereum/ethereum.service'
import { EthereumRPCModule } from 'src/ethereum-rpc/ethereum-rpc.module'

@Module({
  imports: [EthereumRPCModule],
  providers: [EthereumService],
  exports: [EthereumService]
})
export class EthereumModule {}

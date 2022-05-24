import { Module } from '@nestjs/common'
import { RanksController } from 'src/ranks/ranks.controller'
import { RanksService } from './ranks.service'
import { TokenBalancesModule } from 'src/token-balances/token-balances.module'
import { EthereumRPCModule } from 'src/ethereum-rpc/ethereum-rpc.module'

@Module({
  imports: [TokenBalancesModule, EthereumRPCModule],
  controllers: [RanksController],
  providers: [RanksService]
})
export class RanksModule {}

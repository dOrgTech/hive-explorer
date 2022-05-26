import { Module } from '@nestjs/common'
import { RanksController } from 'src/ranks/ranks.controller'
import { RanksService } from './ranks.service'
import { CollectionBalancesModule } from 'src/collection-balances/collection-balances.module'
import { EthereumRPCModule } from 'src/ethereum-rpc/ethereum-rpc.module'

@Module({
  imports: [CollectionBalancesModule, EthereumRPCModule],
  controllers: [RanksController],
  providers: [RanksService]
})
export class RanksModule {}

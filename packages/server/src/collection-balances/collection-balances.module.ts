import { Module } from '@nestjs/common'
import { collectionBalancesProvider } from 'src/collection-balances/collection-balances.provider'
import { CollectionBalancesService } from 'src/collection-balances/collection-balances.service'

@Module({
  providers: [...collectionBalancesProvider, CollectionBalancesService],
  exports: [CollectionBalancesService]
})
export class CollectionBalancesModule {}

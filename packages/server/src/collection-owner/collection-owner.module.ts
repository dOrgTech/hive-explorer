import { Module } from '@nestjs/common'
import { CollectionOwnerService } from './collection-owner.service'
import { collectionOwnerProviders } from './collectionOwnerProviders'

@Module({
  providers: [...collectionOwnerProviders, CollectionOwnerService],
  exports: [CollectionOwnerService]
})
export class CollectionOwnerModule {}

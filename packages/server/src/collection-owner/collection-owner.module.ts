import { Module } from '@nestjs/common'
import { CollectionOwnerService } from 'src/collection-owner/collection-owner.service'
import { collectionOwnerProviders } from 'src/collection-owner/collection-owner.providers'

@Module({
  providers: [...collectionOwnerProviders, CollectionOwnerService],
  exports: [CollectionOwnerService]
})
export class CollectionOwnerModule {}

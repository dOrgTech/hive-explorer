import { Module } from '@nestjs/common'
import { RanksController } from 'src/ranks/ranks.controller'
import { RanksService } from './ranks.service'
import { CollectionOwnerModule } from 'src/collection-owner/collection-owner.module'

@Module({
  imports: [CollectionOwnerModule],
  controllers: [RanksController],
  providers: [RanksService]
})
export class RanksModule {}

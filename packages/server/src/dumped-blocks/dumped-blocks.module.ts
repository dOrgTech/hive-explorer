import { Module } from '@nestjs/common'
import { dumpedBlocksProviders } from 'src/dumped-blocks/dumped-blocks.providers'
import { DumpedBlocksService } from 'src/dumped-blocks/dumped-blocks.service'

@Module({
  providers: [...dumpedBlocksProviders, DumpedBlocksService],
  exports: [DumpedBlocksService]
})
export class DumpedBlocksModule {}

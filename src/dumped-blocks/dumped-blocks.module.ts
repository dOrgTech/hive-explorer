import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { DumpedBlocksService } from 'src/dumped-blocks/dumped-blocks.service'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'

@Module({
  imports: [SequelizeModule.forFeature([DumpedBlock])],
  providers: [DumpedBlocksService],
  exports: [DumpedBlocksService]
})
export class DumpedBlocksModule {}

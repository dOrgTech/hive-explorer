import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'

@Injectable()
export class DumpedBlocksService {
  constructor(@InjectModel(DumpedBlock) private model: typeof DumpedBlock) {}

  findLastDumpedBlock() {
    return this.model.findOne({ order: [['id', 'DESC']] })
  }

  create(block: { number: number; hash: string; parent_hash: string; timestamp: string }) {
    return this.model.create(block)
  }
}

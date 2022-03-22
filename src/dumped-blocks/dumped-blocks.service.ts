import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'

type DumpedBlockCreateRecord = {
  number: number
  hash: string
  parent_hash: string
  timestamp: string
}

@Injectable()
export class DumpedBlocksService {
  constructor(@InjectModel(DumpedBlock) private model: typeof DumpedBlock) {}

  findLastDumpedBlock() {
    return this.model.findOne({ order: [['id', 'DESC']] })
  }

  create(record: DumpedBlockCreateRecord) {
    return this.model.create(record)
  }
}

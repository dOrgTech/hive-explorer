import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'

@Injectable()
export class DumpedBlocksService {
  constructor(@InjectModel(DumpedBlock) private model: typeof DumpedBlock) {}

  async create(block: { number: number; hash: string; parent_hash: string; timestamp: string }) {
    return await this.model.create(block)
  }
}

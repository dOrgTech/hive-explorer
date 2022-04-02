import { Inject, Injectable } from '@nestjs/common'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'
import { Provider } from 'src/_constants/providers'

type DumpedBlockCreateRecord = {
  number: number
  hash: string
  parent_hash: string
  timestamp: string
}

@Injectable()
export class DumpedBlocksService {
  constructor(@Inject(Provider.DumpedBlocksRepository) private dumpedBlocksRepository: typeof DumpedBlock) {}

  findLastDumpedBlock() {
    return this.dumpedBlocksRepository.findOne({ order: [['id', 'DESC']] })
  }

  create(record: DumpedBlockCreateRecord) {
    return this.dumpedBlocksRepository.create(record)
  }
}

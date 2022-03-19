import { Injectable, Logger } from '@nestjs/common'
import { AnyblockService } from 'src/anyblock/anyblock.service'
import { DumpedBlocksService } from 'src/dumped-blocks/dumped-blocks.service'

@Injectable()
export class AppService {
  constructor(
    private logger: Logger,
    private anyblockService: AnyblockService,
    private dumpedBlocksService: DumpedBlocksService
  ) {}

  ping() {
    return JSON.stringify({ message: 'Cent social index is running' })
  }

  async dump() {
    // @TODO: dump from anyblock to our databse
    try {
      const lastBlock = await this.anyblockService.findLastBlock()

      if (!lastBlock) {
        return
      }

      await this.dumpedBlocksService.create({
        number: lastBlock.number,
        hash: lastBlock.hash,
        parent_hash: lastBlock.parent_hash,
        timestamp: lastBlock.timestamp
      })
    } catch (error) {
      this.logger.log(error.message)
    }
  }
}

import { Injectable, Logger } from '@nestjs/common'
import { AnyblockService } from 'src/anyblock/anyblock.service'
import { EventsService } from 'src/events/events.service'
import { DumpedBlocksService } from 'src/dumped-blocks/dumped-blocks.service'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly anyblockService: AnyblockService,
    private readonly eventsService: EventsService,
    private readonly dumpedBlocksService: DumpedBlocksService
  ) {}

  ping() {
    return JSON.stringify({ message: 'Cent social index is running' })
  }

  async dump() {
    // @TODO - clean up / refine this
    try {
      const blockRangeSize = parseInt(this.configService.get(Env.QueryBlockRangeSize), 10)
      const blockRangeFloor = parseInt(this.configService.get(Env.QueryBlockRangeFloor), 10)
      const lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
      const blockRange = { from: null, to: null }
      blockRange.from = Boolean(lastDumpedBlock) ? lastDumpedBlock.number : blockRangeFloor
      blockRange.to = blockRange.from + blockRangeSize

      const lastChainBlock = await this.anyblockService.findLastBlock()
      if (lastChainBlock.number <= blockRange.from) {
        return
      }
      if (lastChainBlock.number > blockRange.from && lastChainBlock.number < blockRange.to) {
        blockRange.to = lastChainBlock.number
      }

      const lastChainBlockToDump = await this.anyblockService.findBlockByNumber(blockRange.to)
      if (!Boolean(lastChainBlock)) {
        return
      }

      const chainEvents = await this.anyblockService.findEventsByBlockRange({ ...blockRange })

      await this.eventsService.bulkCreate(chainEvents)
      await this.dumpedBlocksService.create({
        number: lastChainBlockToDump.number,
        hash: lastChainBlockToDump.hash,
        parent_hash: lastChainBlockToDump.parent_hash,
        timestamp: lastChainBlockToDump.timestamp
      })
    } catch (error) {
      this.logger.log(error.message)
    }
  }
}

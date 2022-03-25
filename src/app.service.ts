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

      if (!Boolean(blockRangeSize)) {
        this.logger.error('QUERY_BLOCK_RANGE_SIZE is not a number or is missing from environment variables')
        return
      }

      if (!Boolean(blockRangeFloor)) {
        this.logger.error('QUERY_BLOCK_RANGE_FLOOR is not a number or is missing from environment variables')
        return
      }

      const lastChainBlock = await this.anyblockService.findLastBlock()
      const lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
      const hasLastDumpedBlock = Boolean(lastDumpedBlock)

      if (hasLastDumpedBlock && lastChainBlock.number < lastDumpedBlock.number + blockRangeSize) {
        setTimeout(() => {
          this.dump()
        }, 10000)
      }

      const blockRange = { from: 0, to: 0 }
      blockRange.from =
        hasLastDumpedBlock && lastDumpedBlock.number > blockRangeFloor ? lastDumpedBlock.number : blockRangeFloor

      blockRange.to =
        blockRange.from + blockRangeSize < lastChainBlock.number
          ? blockRange.from + blockRangeSize
          : lastChainBlock.number

      const chainBlockToDump = await this.anyblockService.findBlockByNumber(blockRange.to)
      const chainEvents = await this.anyblockService.findEventsByBlockRange({ ...blockRange })

      await this.eventsService.bulkCreate(chainEvents)
      await this.dumpedBlocksService.create({
        number: chainBlockToDump.number,
        hash: chainBlockToDump.hash,
        parent_hash: chainBlockToDump.parent_hash,
        timestamp: chainBlockToDump.timestamp
      })

      this.dump()
    } catch (error) {
      this.logger.error(error.message)
    }
  }
}

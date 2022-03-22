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
    private readonly events: EventsService,
    private readonly dumpedBlocksService: DumpedBlocksService
  ) {}

  ping() {
    return JSON.stringify({ message: 'Cent social index is running' })
  }

  async test() {
    const events = await this.anyblockService.findEventsByBlockRange({ from: 14000000, to: 14000100 })
    console.log('events => ', events)
  }

  async dump() {
    try {
      const blockRangeSize = parseInt(this.configService.get(Env.QueryBlockRangeSize), 100)
      const lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
      const blockRange = { from: null, to: null }
      blockRange.from = Boolean(lastDumpedBlock) ? lastDumpedBlock.number : 0
      blockRange.to = blockRange.from + blockRangeSize

      const lastChainBlock = await this.anyblockService.findLastBlock()

      if (lastChainBlock.number > blockRange.from && lastChainBlock.number < blockRange.to) {
        return
      }

      // await this.dumpedBlocksService.create({
      //   number: lastBlock.number,
      //   hash: lastBlock.hash,
      //   parent_hash: lastBlock.parent_hash,
      //   timestamp: lastBlock.timestamp
      // })
    } catch (error) {
      this.logger.log(error.message)
    }
  }
}

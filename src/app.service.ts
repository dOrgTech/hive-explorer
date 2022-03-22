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

  // [EXPERIMENTAL]
  // This queries a bunch of AnyBlock ranges in parallel and dumps them at the same time
  // We're adding a timeout here because we don't want to get throttled by the API and
  // we don't want to overwhelm the framework and lead to dropped requests / logs
  // 
  async dump_fast() {
    const blockRangeSize = parseInt(this.configService.get(Env.QueryBlockRangeSize), 10)
    const blockRangeFloor = parseInt(this.configService.get(Env.QueryBlockRangeFloor), 10)
    const lastChainBlock = await this.anyblockService.findLastBlock()
    for(let i = 6000000, j=2000; i < 7000000; i+=blockRangeSize, j+=2000) {
      setTimeout(() => { this.dump_fast_worker(i, i + blockRangeSize) }, j)
    }
  }

  async dump_fast_worker(from: number, to: number) {
    try {
      const chainEvents = await this.anyblockService.findEventsByBlockRange({ from, to })
      this.eventsService.bulkCreate(chainEvents)
    } catch (error) {
      this.logger.log(error.message)
    }
  }

  async dump() {
    // @TODO - clean up / refine this
    try {
      const blockRangeSize = parseInt(this.configService.get(Env.QueryBlockRangeSize), 10)
      const blockRangeFloor = parseInt(this.configService.get(Env.QueryBlockRangeFloor), 10)
      
      let lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
      const lastChainBlock = await this.anyblockService.findLastBlock()
      const blockRange = { from: null, to: null }
      blockRange.from = Boolean(lastDumpedBlock) ? lastDumpedBlock.number : blockRangeFloor
      blockRange.to = blockRange.from + blockRangeSize
      
      while (blockRange.from < lastChainBlock.number) {
        if (lastChainBlock.number > blockRange.from && lastChainBlock.number < blockRange.to) {
          blockRange.to = lastChainBlock.number
        }

        const lastChainBlockToDump = await this.anyblockService.findBlockByNumber(blockRange.to)
        if (!Boolean(lastChainBlock)) {
          return
        }

        const chainEvents = await this.anyblockService.findEventsByBlockRange({ ...blockRange })

        this.eventsService.bulkCreate(chainEvents)
        await this.dumpedBlocksService.create({
          number: lastChainBlockToDump.number,
          hash: lastChainBlockToDump.hash,
          parent_hash: lastChainBlockToDump.parent_hash,
          timestamp: lastChainBlockToDump.timestamp
        })

        lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
        blockRange.from = Boolean(lastDumpedBlock) ? lastDumpedBlock.number : blockRangeFloor
        blockRange.to = blockRange.from + blockRangeSize
      }
    } catch (error) {
      this.logger.log(error.message)
    }
  }
}

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

  async test() {
    // await this.dumpedBlocksService.create({ number: 1000 })

    const lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
    console.log('lastDumpedBlock.number', lastDumpedBlock?.number, typeof lastDumpedBlock?.number)
    // console.log('lastDumpedBlock => ', lastDumpedBlock, typeof lastDumpedBlock.id)

    const blockChainLastBlock = await this.anyblockService.findLastBlock()
    console.log('blockChainLastBlock => ', blockChainLastBlock, typeof blockChainLastBlock.timestamp)
    console.log('blockChainLastBlock.number', blockChainLastBlock?.number, typeof blockChainLastBlock?.number)
  }

  async dump() {
    try {
      const blockRangeSize = parseInt(this.configService.get(Env.QueryBlockRangeSize), 10)
      if (!Boolean(blockRangeSize)) {
        this.logger.error(`${Env.QueryBlockRangeSize} is not a number or is missing from environment variables`)
        return
      }

      const blockRangeFloor = parseInt(this.configService.get(Env.QueryBlockRangeFloor), 10)
      if (!Boolean(blockRangeFloor)) {
        this.logger.error(`${Env.QueryBlockRangeFloor} is not a number or is missing from environment variables`)
        return
      }

      const rawBlockRangeCeiling = this.configService.get(Env.QueryBlockRangeCeiling)
      const blockRangeCeiling = parseInt(rawBlockRangeCeiling, 10)
      if (rawBlockRangeCeiling && !Boolean(blockRangeCeiling)) {
        this.logger.error(`${Env.QueryBlockRangeCeiling} is not a number`)
        return
      }
      const hasRangeCeiling = Boolean(blockRangeCeiling)

      const lastDumpedBlock = await this.dumpedBlocksService.findLastDumpedBlock()
      const hasLastDumpedBlock = Boolean(lastDumpedBlock)

      // don't run again if there is a ceiling and if we have reached the last block
      const hasReachedCeiling = hasRangeCeiling && hasLastDumpedBlock && lastDumpedBlock.number === blockRangeCeiling
      if (hasReachedCeiling) {
        this.logger.warn(`Reached ${Env.QueryBlockRangeCeiling}. Process complete.`)
        return
      }

      const lastChainBlockNumber = hasRangeCeiling
        ? blockRangeCeiling
        : (await this.anyblockService.findLastBlock())?.number

      const shouldScheduleNextRun =
        !hasRangeCeiling && hasLastDumpedBlock && lastChainBlockNumber < lastDumpedBlock.number + blockRangeSize

      if (shouldScheduleNextRun) {
        const timeout = 10_000
        this.logger.log(`Scheduling next run in ${timeout} ms.`)
        setTimeout(() => {
          this.dump()
        }, timeout)
        return
      }

      const blockRange = { from: 0, to: 0 }
      blockRange.from =
        hasLastDumpedBlock && lastDumpedBlock.number > blockRangeFloor ? lastDumpedBlock.number : blockRangeFloor

      blockRange.to =
        blockRange.from + blockRangeSize < lastChainBlockNumber
          ? blockRange.from + blockRangeSize
          : lastChainBlockNumber

      const chainBlockToDump = await this.anyblockService.findBlockByNumber(blockRange.to)
      const chainEvents = await this.anyblockService.findEventsByBlockRange({ ...blockRange })

      await this.eventsService.bulkCreate(chainEvents)
      await this.dumpedBlocksService.create({ number: chainBlockToDump.number })

      this.dump()
    } catch (error) {
      this.logger.error(error.message)
    }
  }
}

import * as Jaccard from 'jaccard-index'
import { Injectable, Logger } from '@nestjs/common'
import { AnyblockService } from 'src/anyblock/anyblock.service'
import { EventsService } from 'src/events/events.service'
import { DumpedBlocksService } from 'src/dumped-blocks/dumped-blocks.service'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'
import { CollectionOwnerService } from './collection-owner/collection-owner.service'

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly anyblockService: AnyblockService,
    private readonly eventsService: EventsService,
    private readonly dumpedBlocksService: DumpedBlocksService,
    private readonly collectionOwnerService: CollectionOwnerService
  ) {}

  ping() {
    // @TODO: find a proper way to respond with JSON data
    return JSON.stringify({ message: 'Cent social index server is running' })
  }

  async jaccard() {
    const address = '0x60DD04260484B6A3771F99807F62d9897371fa0c'
    const collections = await this.collectionOwnerService.findByOwner(address)
    if (collections.length > 0) {
      const userSet = collections.map(c => c.contract_hash)
      const othersCollections = await this.collectionOwnerService.findSharedCollections(address, userSet)
      const othersCollectionsMap = {}
      othersCollections.forEach(c => {
        if (!othersCollectionsMap[c.owner]) {
          othersCollectionsMap[c.owner] = []
        }
        othersCollectionsMap[c.owner].push(c.contract_hash)
      })
      const scores = []
      const jaccard = Jaccard()
      Object.keys(othersCollectionsMap).forEach(address => {
        scores.push({
          a: address,
          s: jaccard.index(userSet, othersCollectionsMap[address]).toFixed(3)
        })
      })
      const ranked = scores.sort((a, b) => (a.s < b.s ? 1 : -1))
      console.log('hello: ', ranked.slice(0, 10))
      // @TODO: find a proper way to respond with JSON data
      return {
        collections: userSet,
        jaccardRank: ranked.slice(0, 10)
      }
    } else {
      console.log('no collections')
      // @TODO: find a proper way to respond with JSON data
      return JSON.stringify({ message: 'No matches on ' + address })
    }
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
      const lastDumpedBlockNumber = hasLastDumpedBlock ? parseInt(lastDumpedBlock.number, 10) : 0

      // don't run again if there is a ceiling and if we have reached the last block
      const hasReachedCeiling = hasRangeCeiling && hasLastDumpedBlock && lastDumpedBlockNumber === blockRangeCeiling
      if (hasReachedCeiling) {
        this.logger.warn(`Reached ${Env.QueryBlockRangeCeiling}. Process complete.`)
        return
      }

      let lastChainBlockNumber = 0
      if (hasRangeCeiling) {
        lastChainBlockNumber = blockRangeCeiling
      } else {
        const lastChainBlock = await this.anyblockService.findLastBlock()
        lastChainBlockNumber = parseInt(lastChainBlock.number, 10)
      }

      const shouldScheduleNextRun =
        !hasRangeCeiling && hasLastDumpedBlock && lastChainBlockNumber < lastDumpedBlockNumber + blockRangeSize

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
        hasLastDumpedBlock && lastDumpedBlockNumber > blockRangeFloor ? lastDumpedBlockNumber : blockRangeFloor

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

import { Injectable, Logger } from '@nestjs/common'
import { EthereumService } from 'src/ethereum/ethereum.service'
import { TransferEventsService } from 'src/transfer-events/transfer-events.service'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly ethereumService: EthereumService,
    private readonly transferEventsService: TransferEventsService
  ) { }

  private lastBlock: number = 0
  private blockIncrement: number = 100
  private currentBlock: number = 0

  async dump() {
    try {
      // 0. Initialize the current block
      if (this.currentBlock === 0) {
        this.currentBlock = await this.ethereumService.getLatestBlockNumber()
      }

      // 1. check the latest block from the db and class
      if (this.lastBlock == 0) {
        // get the latest block
        const latestEvent = await this.transferEventsService.findLatest()
        if (latestEvent) {
          this.lastBlock = latestEvent.block_number
        }
      }

      if (this.lastBlock > this.currentBlock - 10) {
        // Wait until we are 10+ blocks off the head before polling
        this.currentBlock = await this.ethereumService.getLatestBlockNumber()
        const timeout = 100_000
        this.logger.log(`Scheduling next run in ${timeout} ms.`)
        setTimeout(() => {
          this.dump()
        }, timeout)
        return
      }

      // 2. scan the block range
      try {
        const startBlock = this.lastBlock
        const endBlock = Math.min(startBlock + this.blockIncrement, this.currentBlock)
        this.logger.log(`SCAN: ${startBlock}\tTO: ${endBlock}\tBLOCKS: ${endBlock - startBlock}`)
        const transferEvents = await this.ethereumService.findEventsByBlockRange(startBlock, endBlock)
        this.logger.log(`NEW EVENTS: ${transferEvents.length}`)

        // 3a. insert events into the table
        if (transferEvents.length > 0) {
          this.transferEventsService.bulkCreate(transferEvents)
        }
        this.lastBlock = endBlock + 1
        this.blockIncrement = Math.min(
          10_000,
          Math.floor(Math.min(
            this.blockIncrement * 1.5 + 1,
            5000 * (this.blockIncrement || 1) / (transferEvents.length || 1)
          ))
        )
      }
      catch (e) {
        // 3b. if the range results in an error, reduce the size and retry
        this.logger.error(e.message)
        this.blockIncrement = Math.floor(this.blockIncrement / 2) // Multiplicative decrease
        this.logger.error(`TRIMMING BLOCK RANGE TO: ${this.blockIncrement}`)
      }

      // Run it again
      setTimeout(() => {
        this.dump()
      }, 0)

    } catch (error) {
      this.logger.error(error.message)
    }
  }
}

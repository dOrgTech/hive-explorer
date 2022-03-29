import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Event } from 'src/events/event.entity'

export type EventCreateRecord = {
  nft_name: string
  contract_hash: string
  txn_hash: string
  txn_type: string
  gas: number
  value: number
  from_hash: string
  to_hash: string
  token_id: number
  block_number: number
  timestamp: string
}

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private model: typeof Event) {}

  findAll() {
    return this.model.findAll()
  }

  create(record: EventCreateRecord) {
    return this.model.create(record)
  }

  bulkCreate(records: EventCreateRecord[]) {
    this.model.bulkCreate(records)
  }
}

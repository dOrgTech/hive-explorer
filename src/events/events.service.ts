import { Inject, Injectable } from '@nestjs/common'
import { Event } from 'src/events/event.entity'
import { Provider } from 'src/_constants/providers'

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
  constructor(@Inject(Provider.EventsRepository) private eventRepository: typeof Event) {}

  findAll() {
    return this.eventRepository.findAll()
  }

  create(record: EventCreateRecord) {
    return this.eventRepository.create(record)
  }

  bulkCreate(records: EventCreateRecord[]) {
    this.eventRepository.bulkCreate(records)
  }
}

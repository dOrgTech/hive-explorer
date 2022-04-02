import { Inject, Injectable } from '@nestjs/common'
import { Event } from 'src/events/event.entity'
import { Provider } from 'src/_constants/providers'
import { ChainEventRecord } from 'src/anyblock/types'

@Injectable()
export class EventsService {
  constructor(@Inject(Provider.EventsRepository) private eventRepository: typeof Event) {}

  findAll() {
    return this.eventRepository.findAll()
  }

  create(record: ChainEventRecord) {
    return this.eventRepository.create(record)
  }

  bulkCreate(records: ChainEventRecord[]) {
    return this.eventRepository.bulkCreate(records)
  }
}

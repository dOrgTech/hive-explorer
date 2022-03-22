import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Event } from 'src/events/event.entity'

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private eventModel: typeof Event) {}

  async findAll() {
    return await this.eventModel.findAll()
  }

  async create(
    nft_name: string,
    txn_hash: string,
    txn_type: string,
    gas: number,
    value: number,
    from_hash: string,
    to_hash: string,
    token_id: number,
    block_number: number,
    timestamp: Date
  ) {
    return await this.eventModel.create({
      nft_name,
      txn_hash,
      txn_type,
      gas,
      value,
      from_hash,
      to_hash,
      token_id,
      block_number,
      timestamp
    })
  }
}

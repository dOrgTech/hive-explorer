import { Inject, Injectable } from '@nestjs/common'
import { TransferEvent } from 'src/transfer-events/transfer-event.entity'
import { Provider } from 'src/_constants/providers'
import { TransferEventRecord } from 'src/ethereum/types'

@Injectable()
export class TransferEventsService {
  constructor(@Inject(Provider.TransferEventsRepository) private transferEventRepository: typeof TransferEvent) {}

  findAll() {
    return this.transferEventRepository.findAll()
  }

  findLatest() {
    return this.transferEventRepository.findOne({
      order: [ [ 'block_number', 'DESC' ]],
    })
  }

  bulkCreate(records: TransferEventRecord[]) {
    return this.transferEventRepository.bulkCreate(records, {
      ignoreDuplicates: true
    })
  }
}

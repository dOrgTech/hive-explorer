import { Module } from '@nestjs/common'
import { TransferEventsService } from 'src/transfer-events/transfer-events.service'
import { transferEventsProvider } from 'src/transfer-events/transfer-events.provider'

@Module({
  providers: [...transferEventsProvider, TransferEventsService],
  exports: [TransferEventsService]
})
export class TransferEventsModule {}

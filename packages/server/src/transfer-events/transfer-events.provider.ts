import { Provider } from 'src/_constants/providers'
import { TransferEvent } from 'src/transfer-events/transfer-event.entity'

export const transferEventsProvider = [
  {
    provide: Provider.TransferEventsRepository,
    useValue: TransferEvent
  }
]

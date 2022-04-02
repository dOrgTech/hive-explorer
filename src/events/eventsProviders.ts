import { Provider } from 'src/_constants/providers'
import { Event } from 'src/events/event.entity'

export const eventsProviders = [
  {
    provide: Provider.EventsRepository,
    useValue: Event
  }
]

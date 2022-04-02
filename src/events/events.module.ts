import { Module } from '@nestjs/common'
import { EventsService } from 'src/events/events.service'
import { eventsProviders } from 'src/events/eventsProviders'

@Module({
  providers: [...eventsProviders, EventsService],
  exports: [EventsService]
})
export class EventsModule {}

import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Event } from 'src/events/event.entity'
import { EventsService } from 'src/events/events.service'

@Module({
  imports: [SequelizeModule.forFeature([Event])],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}

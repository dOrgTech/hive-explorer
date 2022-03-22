import { Logger, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'
import { AppService } from 'src/app.service'
import { AppController } from 'src/app.controller'
import { AnyblockModule } from 'src/anyblock/anyblock.module'
import { DumpedBlocksModule } from 'src/dumped-blocks/dumped-blocks.module'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'
import { EventsModule } from 'src/events/events.module'
import { Event } from 'src/events/event.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env[Env.NodeEnv]}`
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPath = config.get<string>(Env.DbPath)
        return {
          dialect: 'sqlite',
          storage: dbPath,
          autoLoadModels: true,
          synchronize: true,
          models: [DumpedBlock, Event]
        }
      }
    }),
    AnyblockModule,
    EventsModule,
    DumpedBlocksModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger]
})
export class AppModule {}

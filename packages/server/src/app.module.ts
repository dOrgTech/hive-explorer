import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env } from 'src/_constants/env'
import { AppService } from 'src/app.service'
import { AppController } from 'src/app.controller'
import { AnyblockModule } from 'src/anyblock/anyblock.module'
import { DumpedBlocksModule } from 'src/dumped-blocks/dumped-blocks.module'
import { EventsModule } from 'src/events/events.module'
import { AppDatabaseModule } from 'src/app-database/app-database.module'
import { TokenModule } from 'src/token/token.module'
import { RanksModule } from 'src/ranks/ranks.module'
import { CollectionOwnerModule } from 'src/collection-owner/collection-owner.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env[Env.NodeEnv]}`
    }),
    AnyblockModule,
    AppDatabaseModule,
    EventsModule,
    DumpedBlocksModule,
    CollectionOwnerModule,
    RanksModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger]
})
export class AppModule {}

import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env } from 'src/_constants/env'
import { AppService } from 'src/app.service'
import { AppController } from 'src/app.controller'
import { EthereumModule } from 'src/ethereum/ethereum.module'
import { TransferEventsModule } from 'src/transfer-events/transfer-events.module'
import { AppDatabaseModule } from 'src/app-database/app-database.module'
import { TokenModule } from 'src/token/token.module'
import { RanksModule } from 'src/ranks/ranks.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env[Env.NodeEnv]}`
    }),
    EthereumModule,
    AppDatabaseModule,
    TransferEventsModule,
    RanksModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger]
})
export class AppModule {}

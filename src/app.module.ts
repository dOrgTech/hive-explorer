import { Logger, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AppService } from 'src/app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DumpedBlocksModule } from 'src/dumped-blocks/dumped-blocks.module'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'
import { AnyblockModule } from './anyblock/anyblock.module'
import { Env } from 'src/_constants/env'
import { AppController } from 'src/app.controller'

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
          models: [DumpedBlock]
        }
      }
    }),
    AnyblockModule,
    DumpedBlocksModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger]
})
export class AppModule {}

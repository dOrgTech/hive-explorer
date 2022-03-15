import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ContractsModule } from 'src/contracts/contracts.module'
import { Contract } from 'src/contracts/contract.entity'
import { AnyblockModule } from './anyblock/anyblock.module'
import { Env } from 'src/_constants/env'

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
          models: [Contract]
        }
      }
    }),
    ContractsModule,
    AnyblockModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

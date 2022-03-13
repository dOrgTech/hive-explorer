import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ContractsModule } from 'src/contracts/contracts.module'
import { Contract } from 'src/contracts/contract.entity'
import { AnyblockModule } from './anyblock/anyblock.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPath = config.get<string>('DB_PATH')
        return {
          dialect: 'sqlite',
          storage: dbPath,
          autoLoadModels: true,
          synchronize: true,
          models: [Contract]
        }
      }
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUserName = config.get<string>('ANYBLOCK_DB_USER')
        const dbPassword = config.get<string>('ANYBLOCK_DB_PASSWORD')
        const dbHost = config.get<string>('ANYBLOCK_DB_HOST')
        const dbName = config.get<string>('ANYBLOCK_DB_NAME')
        const dbPort = config.get<string>('ANYBLOCK_DB_PORT')
        const dbURL = `postgresql://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

        return {
          name: 'anyblock_connection',
          dialect: 'postgres',
          url: dbURL,
          synchronize: false,
          ssl: true
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

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContractsModule } from 'src/contracts/contracts.module'
import { TransactionsModule } from 'src/transactions/transactions.module'
import { Contract } from 'src/contracts/contract.entity'
import { Transaction } from 'src/transactions/transaction.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDevelopment = config.get('NODE_ENV') === 'development'
        const dbPath = config.get<string>('DB_PATH')
        return {
          type: 'sqlite',
          database: dbPath,
          logging: isDevelopment,
          synchronize: isDevelopment,
          entities: [Contract, Transaction]
        }
      }
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDevelopment = config.get('NODE_ENV') === 'development'
        const dbConnectionName = config.get<string>('ANYBLOCK_DB_CONNECTION_NAME')
        const dbUserName = config.get<string>('ANYBLOCK_DB_USER')
        const dbPassword = config.get<string>('ANYBLOCK_DB_PASSWORD')
        const dbHost = config.get<string>('ANYBLOCK_DB_HOST')
        const dbName = config.get<string>('ANYBLOCK_DB_NAME')
        const dbPort = config.get<string>('ANYBLOCK_DB_PORT')
        const dbURL = `postgresql://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

        return {
          name: dbConnectionName,
          type: 'postgres',
          url: dbURL,
          logging: isDevelopment,
          synchronize: false,
          ssl: {
            rejectUnauthorized: false
          }
        }
      }
    }),
    ContractsModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

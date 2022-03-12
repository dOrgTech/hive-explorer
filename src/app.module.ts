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
        return {
          name: config.get<string>('DB_NAME'),
          database: config.get<string>('DB_PATH'),
          type: 'sqlite',
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
        const username = config.get<string>('ANYBLOCK_DB_USER')
        const password = config.get<string>('ANYBLOCK_DB_PASSWORD')
        const host = config.get<string>('ANYBLOCK_DB_HOST')
        const name = config.get<string>('ANYBLOCK_DB_NAME')
        const port = config.get<string>('ANYBLOCK_DB_PORT')

        return {
          type: 'postgres',
          url: `postgresql://${username}:${password}@${host}:${port}/${name}`,
          logging: isDevelopment,
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

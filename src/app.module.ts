import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContractsModule } from 'src/contracts/contracts.module'
import { TransactionsModule } from 'src/transactions/transactions.module'
import { Contract } from 'src/contracts/contract.entity'
import { Transaction } from 'src/transactions/transaction.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      name: 'cent-sqlite',
      database: './db/cent.sqlite',
      logging: true,
      entities: [Contract, Transaction],
      synchronize: true
    }),
    ContractsModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

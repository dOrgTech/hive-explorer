import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/transactions/transaction.entity'
import { TransactionsService } from 'src/transactions/transactions.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService]
})
export class TransactionsModule {}

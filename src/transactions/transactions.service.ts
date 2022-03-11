import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from 'src/transactions/transaction.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private transactionRepository: Repository<Transaction>) {}

  findAll() {
    return this.transactionRepository.find({})
  }

  create(address: string, contractAddress: string) {
    const transaction = this.transactionRepository.create({ address, contract_address: contractAddress })
    return this.transactionRepository.save(transaction)
  }
}

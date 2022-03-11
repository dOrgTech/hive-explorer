import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { ContractsService } from 'src/contracts/contracts.service'
import { TransactionsService } from 'src/transactions/transactions.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const contractService = app.get(ContractsService)
  contractService.create('contract_address', 'ERC721')
  const contracts = await contractService.findAll()
  console.log('contracts => ', contracts)

  const transactionService = app.get(TransactionsService)
  transactionService.create('transaction_address', 'contract_address')
  const transactions = await transactionService.findAll()
  console.log('transactions => ', transactions)

  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`Running on port:${port} in ${process.env.NODE_ENV} mode`)
}
bootstrap()

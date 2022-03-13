import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { ContractsService } from 'src/contracts/contracts.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const contractService = app.get(ContractsService)
  // await contractService.create('contract_address', 'ERC721')
  // const contracts = await contractService.findAll()
  // console.log('contracts => ', contracts)

  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`Running on port:${port} in ${process.env.NODE_ENV} mode`)
}
bootstrap()

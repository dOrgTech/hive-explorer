import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/contract.entity'
import { ContractsService } from 'src/contracts/contracts.service'

@Module({
  imports: [TypeOrmModule.forFeature([Contract], process.env.DB_NAME)],
  providers: [ContractsService]
})
export class ContractsModule {}

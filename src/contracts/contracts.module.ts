import { Module } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/contract.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  providers: [ContractsService]
})
export class ContractsModule {}

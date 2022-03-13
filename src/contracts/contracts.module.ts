import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Contract } from 'src/contracts/contract.entity'
import { ContractsService } from 'src/contracts/contracts.service'

@Module({
  imports: [SequelizeModule.forFeature([Contract])],
  providers: [ContractsService]
})
export class ContractsModule {}

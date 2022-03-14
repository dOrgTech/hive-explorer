import { Injectable } from '@nestjs/common'

import { Contract } from 'src/contracts/contract.entity'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class ContractsService {
  constructor(@InjectModel(Contract) private contractModel: typeof Contract) {}

  async findAll() {
    return await this.contractModel.findAll()
  }

  async create(address: string, contractType: string) {
    return await this.contractModel.create({ address, contract_type: contractType })
  }
}

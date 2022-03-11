import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/contract.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ContractsService {
  constructor(@InjectRepository(Contract) private contractRepository: Repository<Contract>) {}

  findAll() {
    return this.contractRepository.find({})
  }

  create(address: string, contractType: string) {
    const contract = this.contractRepository.create({ address, contract_type: contractType })
    return this.contractRepository.save(contract)
  }
}

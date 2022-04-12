import { Inject, Injectable } from '@nestjs/common'
import { Provider } from 'src/_constants/providers'
import { ChainEventRecord } from 'src/anyblock/types'
import { CollectionOwner } from './collection-owner.entity'
import { Op } from 'sequelize'

@Injectable()
export class CollectionOwnerService {
  constructor(@Inject(Provider.CollectionOwnerRepository) private collectionOwnerRepository: typeof CollectionOwner) {}

  findByOwner(ownerAddress: string) {
    return this.collectionOwnerRepository.findAll({
      attributes: ['contract_hash'],
      where: {
        owner: ownerAddress
      }
    })
  }

  findSharedCollections(ownerAddress: string, ownerCollections: string[]) {
    return this.collectionOwnerRepository.findAll({
      attributes: ['contract_hash', 'owner'],
      where: {
        owner: {
          [Op.notIn]: ['0x0000000000000000000000000000000000000000', ownerAddress]
        },
        contract_hash: {
          [Op.in]: ownerCollections
        }
      }
    })
  }

  findAll() {
    return this.collectionOwnerRepository.findAll()
  }

  create(record: ChainEventRecord) {
    return this.collectionOwnerRepository.create(record)
  }

  bulkCreate(records: ChainEventRecord[]) {
    return this.collectionOwnerRepository.bulkCreate(records)
  }
}

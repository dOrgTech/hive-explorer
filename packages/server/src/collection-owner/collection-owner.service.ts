import { Op } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { Provider } from 'src/_constants/providers'
import { ChainCollectionOwnerRecord, ChainEventRecord } from 'src/anyblock/types'
import { CollectionOwner } from 'src/collection-owner/collection-owner.entity'

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
      },
      limit: 10
    })
  }

  findAll() {
    return this.collectionOwnerRepository.findAll()
  }

  create(record: ChainCollectionOwnerRecord) {
    return this.collectionOwnerRepository.create(record)
  }

  bulkCreate(records: ChainCollectionOwnerRecord[]) {
    return this.collectionOwnerRepository.bulkCreate(records)
  }
}

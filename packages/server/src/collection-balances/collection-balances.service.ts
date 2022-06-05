import { Inject, Injectable } from '@nestjs/common'
import { CollectionBalance } from 'src/collection-balances/collection-balance.entity'
import { TransferEventRecord } from 'src/ethereum/types'
import { Provider } from 'src/_constants/providers'
import { QueryTypes, Op, fn, col } from 'sequelize'
import { ethers } from 'ethers'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

@Injectable()
export class CollectionBalancesService {
  constructor(@Inject(Provider.CollectionBalancesRepository) private collectionBalancesRepository: typeof CollectionBalance) {}

  async bulkUpsert(records: TransferEventRecord[]) {
    const upserts = {};
    records.forEach(r => {
      if (r.from_address !== NULL_ADDRESS) {
        const id = ethers.utils.id(
          `${r.chain_id}-${r.contract_address}-${r.from_address}`
        ).substring(2)

        if (!upserts[id]) {
          upserts[id] = {
            chainID: r.chain_id,
            contract: r.contract_address,
            address: r.from_address,
            quantities: [`-${r.quantity}`]
          }
        }
        else {
          upserts[id].quantities.push(`-${r.quantity}`)
        }
      }
      if (r.to_address !== NULL_ADDRESS) {
        const id = ethers.utils.id(
          `${r.chain_id}-${r.contract_address}-${r.to_address}`
        ).substring(2)

        if (!upserts[id]) {
          upserts[id] = {
            chainID: r.chain_id,
            contract: r.contract_address,
            address: r.to_address,
            quantities: [r.quantity]
          }
        }
        else {
          upserts[id].quantities.push(r.quantity)
        }
      }
    })
    const values = Object.keys(upserts).map(id => {
      const r = upserts[id]
      const balance = r.quantities.join('+')
      return `('${id}',${r.chainID},'${r.contract}','${r.address}',${balance})`
    }).join(',')

    if (values.length > 0) {
      const query = `
      INSERT INTO token_balances (hash_id, chain_id, contract_address, owner_address, balance)
      VALUES ${values}
      ON CONFLICT (hash_id) DO UPDATE SET balance = token_balances.balance + EXCLUDED.balance
      `
      await this.collectionBalancesRepository.sequelize.query(query, { type: QueryTypes.INSERT, raw: true })
    }
  }

  findCollectionsByOwner(ownerAddress: string) {
    return this.collectionBalancesRepository.findAll({
      attributes: ['contract_address'],
      where: {
        owner_address: ownerAddress
      }
    })
  }

  findCollectionOwners(ownerAddress: string, ownerCollections: string[], limit: number, offset: number) {
    return this.collectionBalancesRepository.findAll({
      attributes: [
        [fn('DISTINCT', col('owner_address')), 'owner_address']
      ],
      where: {
        owner_address: {
          [Op.notIn]: [NULL_ADDRESS, ownerAddress]
        },
        contract_address: {
          [Op.in]: ownerCollections
        }
      },
      // order: [[ 'id', 'DESC' ]],
      limit,
      offset
    })
  }

  findAll(limit: number, offset: number) {
    return this.collectionBalancesRepository.findAll({
      attributes: ['contract_address', 'owner_address'],
      // where: {
      //   owner_address: {
      //     [Op.in]: ['0x4133c79E575591b6c380c233FFFB47a13348DE86']
      //   }
      // },
      order: [[ 'id', 'DESC' ]],
      limit,
      offset
    })
  }

  findCollectionsByOwners(ownerAddresses: string[]) {
    return this.collectionBalancesRepository.findAll({
      attributes: ['contract_address', 'owner_address'],
      where: {
        owner_address: {
          [Op.in]: ownerAddresses
        }
      }
    })
  }

  findSharedCollections(ownerAddress: string, ownerCollections: string[]) {
    return this.collectionBalancesRepository.findAll({
      attributes: ['contract_address', 'owner_address'],
      where: {
        owner_address: {
          [Op.notIn]: [NULL_ADDRESS, ownerAddress]
        },
        contract_address: {
          [Op.in]: ownerCollections
        }
      }
    })
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { TokenBalance } from 'src/token-balances/token-balance.entity'
import { TransferEventRecord } from 'src/ethereum/types'
import { Provider } from 'src/_constants/providers'
import { QueryTypes, Op } from 'sequelize'
import { ethers } from 'ethers'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

@Injectable()
export class TokenBalancesService {
  constructor(@Inject(Provider.TokenBalancesRepository) private tokenBalancesRepository: typeof TokenBalance) {}

  async bulkUpsert(records: TransferEventRecord[]) {
    const upserts = {};
    records.forEach(r => {
      if (r.from_address !== NULL_ADDRESS) {
        const id = ethers.utils.id(
          `${r.chain_id}-${r.contract_address}-${r.from_address}-${r.token_id}`
        ).substring(2)

        if (!upserts[id]) {
          upserts[id] = {
            chainID: r.chain_id,
            contract: r.contract_address,
            address: r.from_address,
            tokenID: r.token_id,
            quantities: [`-${r.quantity}`]
          }
        }
        else {
          upserts[id].quantities.push(`-${r.quantity}`)
        }
      }
      if (r.to_address !== NULL_ADDRESS) {
        const id = ethers.utils.id(
          `${r.chain_id}-${r.contract_address}-${r.to_address}-${r.token_id}`
        ).substring(2)

        if (!upserts[id]) {
          upserts[id] = {
            chainID: r.chain_id,
            contract: r.contract_address,
            address: r.to_address,
            tokenID: r.token_id,
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
      return `('${id}',${r.chainID},'${r.contract}','${r.address}',${r.tokenID},${balance})`
    }).join(',')

    if (values.length > 0) {
      const query = `
      INSERT INTO token_balances (id, chain_id, contract_address, owner_address, token_id, balance)
      VALUES ${values}
      ON CONFLICT (id) DO UPDATE SET balance = token_balances.balance + EXCLUDED.balance
      `
      await this.tokenBalancesRepository.sequelize.query(query, { type: QueryTypes.INSERT, raw: true })
    }
  }

  findCollectionsByOwner(ownerAddress: string) {
    return this.tokenBalancesRepository.findAll({
      attributes: ['contract_address'],
      where: {
        owner_address: ownerAddress,
        balance: {
          [Op.gt]: 0
        }
      }
    })
  }

  findSharedCollections(ownerAddress: string, ownerCollections: string[]) {
    return this.tokenBalancesRepository.findAll({
      attributes: ['contract_address', 'owner_address'],
      where: {
        owner_address: {
          [Op.notIn]: [NULL_ADDRESS, ownerAddress]
        },
        contract_address: {
          [Op.in]: ownerCollections
        },
        balance: {
          [Op.gt]: 0
        }
      }
    })
  }
}

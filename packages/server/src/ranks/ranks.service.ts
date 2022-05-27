import Jaccard from 'jaccard-index'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { Provider } from 'src/_constants/providers'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { CollectionBalancesService } from 'src/collection-balances/collection-balances.service'
import { Contract, ethers } from 'ethers'
import { Env } from 'src/_constants/env'
import { ErrorMessage } from 'src/_constants/errors'

@Injectable()
export class RanksService {
  constructor(
    private readonly logger: Logger,
    private readonly collectionBalancesService: CollectionBalancesService,
    @Inject(Provider.EthersProvider) private provider: ethers.providers.JsonRpcProvider
  ) {
    this.init()
  }

  private ownerContractMap = { }
  private contractOwnerMap = { }

  async init() {
    const limit = 1_000_000
    let offset = 0
    const arr = []
    while (true) {
      const results = await this.collectionBalancesService.findAll(limit, offset)
      if (results.length == 0) {
        break
      }
      results.forEach((c, i) => {
        const ownerAddress = c.owner_address.toLowerCase()
        if (!this.ownerContractMap[ownerAddress]) {
          this.ownerContractMap[ownerAddress] = new Set()
        }
        this.ownerContractMap[ownerAddress].add(c.contract_address)
        if (!this.contractOwnerMap[c.contract_address]) {
          this.contractOwnerMap[c.contract_address] = new Set()
        }
        this.contractOwnerMap[c.contract_address].add(ownerAddress)
      })
      offset += results.length
      this.logger.log(`MAPPED: ${offset} entries`)
    }
    this.logger.log('LOADED')
  }

  async getRankByAddress(address: string) {
    const SIMILAR_ADDRESS_COUNT = 50

    const resolvedAddress = await this.provider.resolveName(address.toLocaleLowerCase())

    if (resolvedAddress == null || !isEthereumAddress(resolvedAddress)) {
      throw new Error(ErrorMessage.NotAnEthAddress)
    }

    const normalizedAddress = ethers.utils.getAddress(resolvedAddress).toLowerCase()

    let ranked = []
    const userCollections: string[] = Array.from(this.ownerContractMap[normalizedAddress] || [])
    userCollections.forEach(contract => {
      const matches = { [normalizedAddress]: true }
      ranked.forEach(r => matches[r.address] = true)

      const owners: string[] = Array.from(this.contractOwnerMap[contract])

      ranked = owners
        .filter(address => !matches[address])
        .map(address => ({
          address,
          score: Jaccard().index(userCollections, Array.from(this.ownerContractMap[address] || [])).toFixed(3)
        }))
        .concat(ranked)
        .sort((a, b) => (a.score < b.score ? 1 : -1))
        .slice(0, 1_000)
    })

    const contractAbi = ['function name() view returns (string)']

    const userCollectionsNames = await Promise.all(
      userCollections.map(async contractAddress => {
        try {
          const contract = new ethers.Contract(contractAddress, contractAbi, this.provider) as Contract
          const name = await contract.name() as string
          return {
            collection_address: contractAddress,
            collection_name: name
          }
        } catch (error) {
          return {
            collection_address: contractAddress,
            collection_name: null
          }
        }
      })
    )

    const rankedSubset = await Promise.all(
      ranked.slice(0, SIMILAR_ADDRESS_COUNT).map(async record => {
        let ens: string
        try {
          ens = (await this.provider.lookupAddress(record.address)) || record.address
        } catch (error) {
          ens = null
        }

        return {
          address: record.address,
          ens: ens,
          score: record.score
        }
      })
    )

    if (rankedSubset.length === 0) {
      const ens = (await this.provider.lookupAddress(normalizedAddress)) || normalizedAddress
      return {
        collections: [],
        rank: [{
          address: normalizedAddress,
          ens: ens,
          score: '1.000'
        }]
      }
    }

    return {
      collections: userCollectionsNames,
      rank: rankedSubset
    }
  }
}

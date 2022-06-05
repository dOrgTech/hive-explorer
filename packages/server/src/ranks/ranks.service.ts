import Jaccard from 'jaccard-index'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { Provider } from 'src/_constants/providers'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { CollectionBalancesService } from 'src/collection-balances/collection-balances.service'
import { Contract, ethers } from 'ethers'
import { Env } from 'src/_constants/env'
import { ErrorMessage } from 'src/_constants/errors'

const jaccard = (setA, setB) => {
  let intersection = 0
  if (setA.size < setB.size) {
    setA.forEach((n) => {
      if (setB.has(n)) {
        intersection++
      }
    })
  }
  else {
    setB.forEach((n) => {
      if (setA.has(n)) {
        intersection++
      }
    })
  }
  return intersection / (setA.size + setB.size - intersection)
}

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
    const start = new Date().getTime()
    const SIMILAR_ADDRESS_COUNT = 50

    const resolvedAddress = await this.provider.resolveName(address.toLocaleLowerCase())

    if (resolvedAddress == null || !isEthereumAddress(resolvedAddress)) {
      throw new Error(ErrorMessage.NotAnEthAddress)
    }

    const normalizedAddress = ethers.utils.getAddress(resolvedAddress).toLowerCase()

    let ranked = []
    let cutoff = 0
    let matches = new Set([normalizedAddress])
    const userCollections = this.ownerContractMap[normalizedAddress] || new Set()
    const userCollectionsSize = userCollections.size
    userCollections.forEach(contract => {
      const list = []
      this.contractOwnerMap[contract].forEach(owner => {
        if (!matches.has(owner)) {
          const otherCollections = this.ownerContractMap[owner] || new Set()
          if (otherCollections.size / userCollectionsSize > cutoff) {
            const score = jaccard(userCollections, otherCollections)
            if (score > cutoff) {
              list.push({
                address: owner,
                score
              })
            }
          }
        }
      })

      if (list.length > 0) {
        ranked = list
          .concat(ranked)
          .sort((a, b) => (a.score < b.score ? 1 : -1))
          .slice(0, SIMILAR_ADDRESS_COUNT)

        cutoff = ranked.length == SIMILAR_ADDRESS_COUNT ? ranked[SIMILAR_ADDRESS_COUNT - 1].score : 0
        matches = new Set(ranked.map(r => r.address).concat(normalizedAddress))
      }
    })
    this.logger.log(`Ranked in ${Math.floor((new Date().getTime() - start) / 1000)}s`)

    const contractAbi = ['function name() view returns (string)']
    const userCollectionsNames = await Promise.all(
      Array.from(userCollections).map(async (contractAddress: string) => {
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

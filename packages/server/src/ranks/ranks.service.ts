import Jaccard from 'jaccard-index'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { Provider } from 'src/_constants/providers'
import { Inject, Injectable } from '@nestjs/common'
import { CollectionBalancesService } from 'src/collection-balances/collection-balances.service'
import { Contract, ethers } from 'ethers'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'
import { ErrorMessage } from 'src/_constants/errors'

@Injectable()
export class RanksService {
  constructor(
    private readonly configService: ConfigService,
    private readonly collectionBalancesService: CollectionBalancesService,
    @Inject(Provider.EthersProvider) private provider: ethers.providers.JsonRpcProvider
  ) {}

  async getRankByAddress(address: string) {
    const SIMILAR_ADDRESS_COUNT = 50

    const resolvedAddress = await this.provider.resolveName(address.toLocaleLowerCase())

    if (resolvedAddress == null || !isEthereumAddress(resolvedAddress)) {
      throw new Error(ErrorMessage.NotAnEthAddress)
    }

    const normalizedAddress = ethers.utils.getAddress(resolvedAddress).toLowerCase()

    const collections = await this.collectionBalancesService.findCollectionsByOwner(normalizedAddress)
    if (collections.length > 0) {
      const userSet = collections.map(c => c.contract_address)
      const othersCollections = await this.collectionBalancesService.findSharedCollections(normalizedAddress, userSet)

      const othersCollectionsMap = {}
      othersCollections.forEach(c => {
        if (!othersCollectionsMap[c.owner_address]) {
          othersCollectionsMap[c.owner_address] = []
        }
        othersCollectionsMap[c.owner_address].push(c.contract_address)
      })

      const ranked = Object.keys(othersCollectionsMap)
        .map(address => ({
          address: address,
          score: Jaccard().index(userSet, othersCollectionsMap[address]).toFixed(3) as string
        }))
        .sort((a, b) => (a.score < b.score ? 1 : -1))

      const contractAbi = ['function name() view returns (string)']

      const userSetNames = await Promise.all(
        userSet.map(async contract_address => {
          try {
            const contract = new ethers.Contract(contract_address, contractAbi, this.provider) as Contract
            const name = await contract.name() as string
            return {collection_address: contract_address, collection_name: name}
          } catch (error) {
            return {collection_address: contract_address, collection_name: null}
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

      return {
        collections: userSetNames,
        rank: rankedSubset
      }
    } else {
      return { collections: [], rank: [] }
    }
  }
}

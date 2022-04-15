import * as Jaccard from 'jaccard-index'
import { Injectable } from '@nestjs/common'
import { CollectionOwnerService } from 'src/collection-owner/collection-owner.service'
import { Contract, ethers } from 'ethers'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'

@Injectable()
export class RanksService {
  constructor(
    private readonly configService: ConfigService,
    private readonly collectionOwnerService: CollectionOwnerService
  ) {}

  async getRankByAddress(address: string) {
    const SIMILAR_ADDRESS_COUNT = 50

    const infuraKey = this.configService.get(Env.InfuraKey)

    if (!infuraKey) {
      throw new Error('INFURA_KEY not present')
    }

    const collections = await this.collectionOwnerService.findByOwner(address)
    if (collections.length > 0) {
      const userSet = collections.map(c => c.contract_hash)
      const othersCollections = await this.collectionOwnerService.findSharedCollections(address, userSet)

      const othersCollectionsMap = {}
      othersCollections.forEach(c => {
        if (!othersCollectionsMap[c.owner]) {
          othersCollectionsMap[c.owner] = []
        }
        othersCollectionsMap[c.owner].push(c.contract_hash)
      })

      const ranked = Object.keys(othersCollectionsMap)
        .map(address => ({
          address: address,
          score: Jaccard().index(userSet, othersCollectionsMap[address]).toFixed(3) as string
        }))
        .sort((a, b) => (a.score < b.score ? 1 : -1))

      const contractAbi = ['function name() view returns (string)']
      const provider = new ethers.providers.InfuraProvider(1, infuraKey)

      const userSetNames = [] as string[]
      await Promise.all(
        userSet.map(async contract_hash => {
          const contract = new ethers.Contract(contract_hash, contractAbi, provider) as Contract
          const contractName = await contract.name()
          userSetNames.push(contractName)
        })
      )

      const rankedSubset = ranked.slice(0, SIMILAR_ADDRESS_COUNT)
      await Promise.all(
        rankedSubset.map(async similarAddress => {
          similarAddress.address = (await provider.lookupAddress(similarAddress.address)) || similarAddress.address
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

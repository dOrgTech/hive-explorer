import * as Jaccard from 'jaccard-index'
import { Injectable } from '@nestjs/common'
import { CollectionOwnerService } from 'src/collection-owner/collection-owner.service'

@Injectable()
export class RanksService {
  constructor(private readonly collectionOwnerService: CollectionOwnerService) {}

  async getRankByAddress(address: string) {
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

      return {
        collections: userSet,
        rank: ranked.slice(0, 10)
      }
    } else {
      return { collections: [], rank: [] }
    }
  }
}

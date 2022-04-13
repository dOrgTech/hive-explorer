import { Provider } from 'src/_constants/providers'
import { CollectionOwner } from 'src/collection-owner/collection-owner.entity'

export const collectionOwnerProviders = [
  {
    provide: Provider.CollectionOwnerRepository,
    useValue: CollectionOwner
  }
]

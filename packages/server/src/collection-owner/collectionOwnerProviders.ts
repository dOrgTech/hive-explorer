import { Provider } from 'src/_constants/providers'
import { CollectionOwner } from './collection-owner.entity'

export const collectionOwnerProviders = [
  {
    provide: Provider.CollectionOwnerRepository,
    useValue: CollectionOwner
  }
]

import { Provider } from 'src/_constants/providers'
import { CollectionBalance } from 'src/collection-balances/collection-balance.entity'

export const collectionBalancesProvider = [
  {
    provide: Provider.CollectionBalancesRepository,
    useValue: CollectionBalance
  }
]

import { Provider } from 'src/_constants/providers'
import { TokenBalance } from 'src/token-balances/token-balance.entity'

export const tokenBalancesProvider = [
  {
    provide: Provider.TokenBalancesRepository,
    useValue: TokenBalance
  }
]

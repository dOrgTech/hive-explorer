import { Module } from '@nestjs/common'
import { tokenBalancesProvider } from 'src/token-balances/token-balances.provider'
import { TokenBalancesService } from 'src/token-balances/token-balances.service'

@Module({
  providers: [...tokenBalancesProvider, TokenBalancesService],
  exports: [TokenBalancesService]
})
export class TokenBalancesModule {}

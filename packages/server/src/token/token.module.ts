import { Module } from '@nestjs/common'
import { TokenController } from 'src/token/token.controller'
import { TokenService } from './token.service'

@Module({
  imports: [],
  controllers: [TokenController],
  providers: [TokenService]
})
export class TokenModule {}

import { ethers } from 'ethers'
import { Controller, Post, HttpException, HttpStatus, Body } from '@nestjs/common'
import { TokenService } from 'src/token/token.service'
import { ErrorMessage } from 'src/_constants/errors'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Post('/upload')
  async rank(
    @Body('image') image: string,
    @Body('address') address: string,
    @Body('timestamp') timestamp: string,
    @Body('signature') signature: string
  ) {
    try {
      const message = `Minting my Hive.\n\nTimestamp: ${timestamp}`
      const recoveredSigner = ethers.utils.verifyMessage(message, signature)
      if (address != recoveredSigner) {
        throw new Error('Invalid signature')
      }
      const now = Math.floor(new Date().getTime() / 1000)
      if (Math.abs(now - parseInt(timestamp)) > 300) {
        throw new Error('Expired signature')
      }
      return await this.tokenService.uploadToIPFS(image, address)
    } catch (error) {
      console.log(error.message)
      throw new HttpException(ErrorMessage.InternalServerError, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

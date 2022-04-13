import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { ethers, getDefaultProvider } from 'ethers'
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common'
import { RanksService } from 'src/ranks/ranks.service'
import { ErrorMessage } from 'src/_constants/errors'

@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}
  @Get('/:address')
  async rank(@Param('address') address: string) {
    const provider = getDefaultProvider()
    const resolvedAddress = await provider.resolveName(address.toLocaleLowerCase())

    if (resolvedAddress == null || !isEthereumAddress(resolvedAddress)) {
      throw new HttpException(ErrorMessage.NotAnEthAddress, HttpStatus.BAD_REQUEST)
    }

    const normalizedAddress = ethers.utils.getAddress(resolvedAddress)

    try {
      return await this.ranksService.getRankByAddress(normalizedAddress)
    } catch (error) {
      throw new HttpException(ErrorMessage.InternalServerError, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

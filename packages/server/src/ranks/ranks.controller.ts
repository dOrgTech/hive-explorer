import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common'
import { RanksService } from 'src/ranks/ranks.service'
import { ErrorMessage } from 'src/_constants/errors'

@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}
  @Get('/:address')
  async rank(@Param('address') address: string) {
    try {
      return await this.ranksService.getRankByAddress(address)
    } catch (error) {
      throw new HttpException(ErrorMessage.InternalServerError, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

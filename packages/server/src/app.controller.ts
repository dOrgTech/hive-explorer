import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  ping() {
    return { message: 'Cent social index server is running' }
  }

  @Get('/score/:address')
  async score(@Param() params) {
    const results = await this.appService.jaccard(params.address)
    return results
  }
}

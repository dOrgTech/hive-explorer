import { Controller, Get, Query } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  ping() {
    return { message: 'Cent social index server is running' }
  }

  @Get('/rank')
  rank(@Query() query) {
    console.log(query)
    return 'handles get rank'
  }
}

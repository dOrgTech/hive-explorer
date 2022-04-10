import { Controller, Get, Query } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('/ping')
  ping() {
    return { message: 'Cent social index server is running' }
  }
}

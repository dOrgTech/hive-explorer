import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { Env } from 'src/_constants/env'
import { AppService } from 'src/app.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appService = app.get(AppService)
  // appService.dump()
  appService.test()

  const port = process.env[Env.AppPort] || 5001
  await app.listen(port)
  Logger.log(`Running on port:${port} in ${process.env.NODE_ENV} mode`)
}
bootstrap()

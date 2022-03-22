import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { Env } from 'src/_constants/env'
import { AppService } from 'src/app.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appService = app.get(AppService)
  setInterval(() => {
    // @TODO - clean up / refine this process
    appService.dump()
  }, 1000)

  // testing
  // await appService.test()

  const port = process.env[Env.Port] || 3000
  await app.listen(port)
  Logger.log(`Running on port:${port} in ${process.env.NODE_ENV} mode`)
}
bootstrap()

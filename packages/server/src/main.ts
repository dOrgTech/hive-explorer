import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { Env } from 'src/_constants/env'
import { AppService } from 'src/app.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // @TODO: this has to be changed for production
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
  })

  const appService = app.get(AppService)
  appService.jaccard()

  if (process.env[Env.RunDump] === 'true') {
    appService.dump()
  }

  const port = process.env[Env.AppPort] || 5001
  await app.listen(port)
  Logger.log(`Running on port:${port} in ${process.env.NODE_ENV} mode`)
}
bootstrap()

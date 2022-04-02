import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'
import { Provider } from 'src/_constants/providers'
import { Env } from 'src/_constants/env'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'
import { Event } from 'src/events/event.entity'

export const appDatabaseProvider = [
  {
    provide: Provider.AppDatabase,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const host = config.get<string>(Env.AppDbHost)
      const database = config.get<string>(Env.AppDbDatabase)
      const port = parseInt(config.get<string>(Env.AppDbPort), 10)
      const username = config.get<string>(Env.AppDbUsername)
      const password = config.get<string>(Env.AppDbPassword)
      const url = `postgresql://${username}:${password}@${host}:${port}/${database}`

      const sequelize = new Sequelize(url, { dialect: 'postgres' })
      sequelize.addModels([DumpedBlock, Event])
      await sequelize.sync()

      return sequelize
    }
  }
]

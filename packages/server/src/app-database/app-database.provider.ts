import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'
import { Provider } from 'src/_constants/providers'
import { Env } from 'src/_constants/env'
import { TransferEvent } from 'src/transfer-events/transfer-event.entity'
import { TokenBalance } from 'src/token-balances/token-balance.entity'

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

      const sequelize = new Sequelize(url, {
        logging: false,
        dialect: 'postgres',
        define: {
          timestamps: false
        }
      })
      sequelize.addModels([TransferEvent, TokenBalance])
      // @TODO: maybe we don't need to sync in production (find a way to do migrations)
      await sequelize.sync()
      return sequelize
    }
  }
]

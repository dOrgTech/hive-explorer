import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'
import { Provider } from 'src/_constants/providers'
import { Env } from 'src/_constants/env'

export const anyblockDatabaseProvider = [
  {
    provide: Provider.AnyBlockDatabase,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const host = config.get<string>(Env.AnyblockDbHost)
      const database = config.get<string>(Env.AnyblockDbDatabase)
      const port = parseInt(config.get<string>(Env.AnyblockDbPort), 10)
      const username = config.get<string>(Env.AnyblockDbUsername)
      const password = config.get<string>(Env.AnyblockDbPassword)
      const url = `postgresql://${username}:${password}@${host}:${port}/${database}`

      return new Sequelize(url, {
        dialect: 'postgres',
        logging: false,
	define: { timestamps: false },
	dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      })
    }
  }
]

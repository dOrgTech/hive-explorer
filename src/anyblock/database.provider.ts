import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const dbUserName = config.get<string>('ANYBLOCK_DB_USER')
      const dbPassword = config.get<string>('ANYBLOCK_DB_PASSWORD')
      const dbHost = config.get<string>('ANYBLOCK_DB_HOST')
      const dbName = config.get<string>('ANYBLOCK_DB_NAME')
      const dbPort = config.get<string>('ANYBLOCK_DB_PORT')
      const dbURL = `postgresql://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

      const sequelize = new Sequelize({
        dialect: 'postgres',
        url: dbURL,
        synchronize: false,
        ssl: true
      })
      await sequelize.sync()
      return sequelize
    }
  }
]

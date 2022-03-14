import { Module } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { ConfigService } from '@nestjs/config'
import { Provider } from 'src/_constants/providers'

export const anyblockDatabaseProvider = [
  {
    provide: Provider.AnyBlockDatabase,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const host = config.get<string>('ANYBLOCK_DB_HOST')
      const database = config.get<string>('ANYBLOCK_DB_DATABASE')
      const port = parseInt(config.get<string>('ANYBLOCK_DB_PORT'), 10)
      const username = config.get<string>('ANYBLOCK_DB_USERNAME')
      const password = config.get<string>('ANYBLOCK_DB_PASSWORD')
      const url = `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require`

      return new Sequelize(url, {
        dialect: 'postgres',
        dialectOptions: {
          ssl: true
        }
      })
    }
  }
]

@Module({
  providers: [...anyblockDatabaseProvider],
  exports: [...anyblockDatabaseProvider]
})
export class AnyblockDatabaseModule {}

import { Module } from '@nestjs/common'
import { AnyblockService } from 'src/anyblock/anyblock.service'
import { Sequelize } from 'sequelize-typescript'
import { getConnectionToken } from '@nestjs/sequelize'

@Module({
  providers: [
    {
      provide: AnyblockService,
      useFactory: (anyblockSequelize: Sequelize) => {
        return new AnyblockService(anyblockSequelize)
      },
      inject: [getConnectionToken('anyblock_connection')]
    }
  ]
})
export class AnyblockModule {}

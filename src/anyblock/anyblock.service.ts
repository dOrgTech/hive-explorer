import { Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class AnyblockService {
  constructor(db: Sequelize) {
    console.log('====DB==== ', db)
  }
}

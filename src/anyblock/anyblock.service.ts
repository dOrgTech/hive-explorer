import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Provider } from 'src/_constants/providers'
import { QueryTypes } from 'sequelize'
import { BlockRecord } from 'src/anyblock/types'

@Injectable()
export class AnyblockService {
  constructor(@Inject(Provider.AnyBlockDatabase) private db: Sequelize) {}

  async findLastBlock(): Promise<BlockRecord> {
    const query = `SELECT * FROM block ORDER BY number DESC LIMIT 1`
    const records = await this.db.query<BlockRecord>(query, { type: QueryTypes.SELECT })
    return records[0] || null
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Provider } from 'src/_constants/providers'

@Injectable()
export class AnyblockService {
  constructor(@Inject(Provider.AnyBlockDatabase) private db: Sequelize) {}

  async findAllContracts() {
    const query = `SELECT * FROM contract`

    return await this.db.query(query)
  }
}

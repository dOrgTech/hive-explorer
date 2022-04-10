import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'collection_owner' })
export class CollectionOwner extends Model {
  @Column({ type: DataType.CHAR(66) })
  contract_hash: string
  @Column({ type: DataType.CHAR(42) })
  owner: string
}

import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'collection_owner' })
export class CollectionOwner extends Model {
  @Column({ type: DataType.TEXT })
  contract_hash: string
  @Column({ type: DataType.TEXT })
  owner: string
}

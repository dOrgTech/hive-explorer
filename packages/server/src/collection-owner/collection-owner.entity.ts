import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'collection_owner' })
export class CollectionOwner extends Model {
  @Column({ type: DataType.CHAR(66), primaryKey: true })
  contract_hash: string
  @Column({ type: DataType.CHAR(42), primaryKey: true })
  owner: string
}

import { Table, Model, Column, DataType, Index } from 'sequelize-typescript'

@Table({ tableName: 'collection_owner' })
export class CollectionOwner extends Model {
  @Index('contract_hash_index')
  @Column({ type: DataType.CHAR(42), primaryKey: true })
  contract_hash: string

  @Index('owner_index')
  @Column({ type: DataType.CHAR(42), primaryKey: true })
  owner: string
}

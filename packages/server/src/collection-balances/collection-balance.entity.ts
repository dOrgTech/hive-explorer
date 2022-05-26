import { Table, Model, Column, DataType, PrimaryKey, Index, Unique } from 'sequelize-typescript'

@Table({ tableName: 'collection_balances' })
export class CollectionBalance extends Model {
  @Unique
  @Column({ type: DataType.CHAR(64) })
  hash_id: string

  @Index('cb_chain_id_index')
  @Column({ type: DataType.INTEGER })
  chain_id: number

  @Index('cb_contract_address_index')
  @Column({ type: DataType.CHAR(42) })
  contract_address: string

  @Index('cb_owner_address_index')
  @Column({ type: DataType.CHAR(42) })
  owner_address: string

  @Index('cb_token_balance_index')
  @Column({ type: DataType.DECIMAL(78,0) })
  balance: string
}

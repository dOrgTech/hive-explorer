import { Table, Model, Column, DataType, PrimaryKey, Index } from 'sequelize-typescript'

@Table({ tableName: 'token_balances' })
export class TokenBalance extends Model {
  @PrimaryKey
  @Column({ type: DataType.CHAR(64) })
  id: string

  @Index('tb_chain_id_index')
  @Column({ type: DataType.INTEGER })
  chain_id: number

  @Index('tb_contract_address_index')
  @Column({ type: DataType.CHAR(42) })
  contract_address: string

  @Index('tb_owner_address_index')
  @Column({ type: DataType.CHAR(42) })
  owner_address: string

  @Index('tb_token_id_index')
  @Column({ type: DataType.DECIMAL(78,0) })
  token_id: string

  @Index('tb_token_balance_index')
  @Column({ type: DataType.DECIMAL(78,0) })
  balance: string
}

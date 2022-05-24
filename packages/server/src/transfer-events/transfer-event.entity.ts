import { Table, Model, Column, DataType, Index, PrimaryKey } from 'sequelize-typescript'

@Table({ tableName: 'transfer_events' })
export class TransferEvent extends Model {
  @PrimaryKey
  @Column({ type: DataType.CHAR(30) })
  id: string

  @Index('te_chain_id_index')
  @Column({ type: DataType.INTEGER })
  chain_id: number

  @Index('te_contract_address_index')
  @Column({ type: DataType.CHAR(42) })
  contract_address: string

  @Index('te_from_address_index')
  @Column({ type: DataType.CHAR(42) })
  from_address: string

  @Index('te_to_address_index')
  @Column({ type: DataType.CHAR(42) })
  to_address: string

  @Index('te_token_id_index')
  @Column({ type: DataType.DECIMAL(78,0) })
  token_id: string

  @Column({ type: DataType.DECIMAL(78,0) })
  quantity: string

  @Index('te_txn_id_index')
  @Column({ type: DataType.CHAR(66) })
  txn_id: string

  @Index('te_block_number_index')
  @Column({ type: DataType.INTEGER })
  block_number: number
}

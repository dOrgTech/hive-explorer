import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'events' })
export class Event extends Model {
  @Column({ type: DataType.CHAR(10) })
  block_number: string
  @Column({ type: DataType.CHAR(42) })
  contract_hash: string
  @Column({ type: DataType.TEXT })
  nft_name: string
  @Column({ type: DataType.CHAR(66) })
  txn_hash: string
  @Column({ type: DataType.CHAR(10) })
  txn_type: string
  @Column({ type: DataType.CHAR(32) })
  gas: string
  @Column({ type: DataType.CHAR(78) })
  value: string
  @Column({ type: DataType.CHAR(42) })
  from_hash: string
  @Column({ type: DataType.CHAR(42) })
  to_hash: string
  @Column({ type: DataType.CHAR(78) })
  token_id: string
  @Column({ type: DataType.TIME })
  timestamp: Date
}

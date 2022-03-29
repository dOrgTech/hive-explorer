import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'events' })
export class Event extends Model {
  @Column({ type: DataType.NUMBER })
  block_number: number
  @Column({ type: DataType.TEXT })
  contract_hash: string
  @Column({ type: DataType.TEXT })
  nft_name: string
  @Column({ type: DataType.TEXT })
  txn_hash: string
  @Column({ type: DataType.TEXT })
  txn_type: string
  @Column({ type: DataType.NUMBER })
  gas: number
  @Column({ type: DataType.NUMBER })
  value: number
  @Column({ type: DataType.TEXT })
  from_hash: string
  @Column({ type: DataType.TEXT })
  to_hash: string
  @Column({ type: DataType.TEXT })
  token_id: number
  @Column({ type: DataType.TIME })
  timestamp: Date
}

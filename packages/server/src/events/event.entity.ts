import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'events' })
export class Event extends Model {
  @Column({ type: DataType.TEXT })
  block_number: string
  @Column({ type: DataType.TEXT })
  contract_hash: string
  @Column({ type: DataType.TEXT })
  nft_name: string
  @Column({ type: DataType.TEXT })
  txn_hash: string
  @Column({ type: DataType.TEXT })
  txn_type: string
  @Column({ type: DataType.TEXT })
  gas: string
  @Column({ type: DataType.TEXT })
  value: string
  @Column({ type: DataType.TEXT })
  from_hash: string
  @Column({ type: DataType.TEXT })
  to_hash: string
  @Column({ type: DataType.TEXT })
  token_id: string
  @Column({ type: DataType.TIME })
  timestamp: Date
}

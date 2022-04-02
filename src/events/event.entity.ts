import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table({ tableName: 'events' })
export class Event extends Model {
  @Column
  block_number: number
  @Column
  contract_hash: string
  @Column
  nft_name: string
  @Column
  txn_hash: string
  @Column
  txn_type: string
  @Column
  gas: number
  @Column
  value: number
  @Column
  from_hash: string
  @Column
  to_hash: string
  @Column
  token_id: number
  @Column({ type: DataType.TIME })
  timestamp: Date
}

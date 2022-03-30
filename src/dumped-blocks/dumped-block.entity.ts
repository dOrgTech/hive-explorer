import { Table, Model, Column, DataType, Unique } from 'sequelize-typescript'

@Table({ tableName: 'dumped_blocks' })
export class DumpedBlock extends Model {
  @Unique
  @Column({ type: DataType.NUMBER })
  number: number
  @Unique
  @Column({ type: DataType.TEXT })
  hash: string
  @Column({ type: DataType.TEXT })
  parent_hash: string
  @Column({ type: DataType.TIME })
  timestamp: string
}

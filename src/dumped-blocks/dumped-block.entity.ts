import { Table, Model, Column, DataType, Unique } from 'sequelize-typescript'

@Table({ tableName: 'dumped_blocks' })
export class DumpedBlock extends Model {
  @Unique
  @Column
  number: number
  @Unique
  @Column
  hash: string
  @Column
  parent_hash: string
  @Column({ type: DataType.TIME })
  timestamp: string
}

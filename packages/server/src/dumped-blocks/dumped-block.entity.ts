import { Table, Model, Column, DataType, Unique } from 'sequelize-typescript'

@Table({ tableName: 'dumped_blocks' })
export class DumpedBlock extends Model {
  @Unique
  @Column({ type: DataType.CHAR(10) })
  number: string
}

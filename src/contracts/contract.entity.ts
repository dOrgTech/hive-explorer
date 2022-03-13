import { Table, Model, Column } from 'sequelize-typescript'

@Table
export class Contract extends Model {
  @Column
  address: string
  @Column
  contract_type: string
}

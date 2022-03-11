import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Transaction {
  @PrimaryColumn({ unique: true })
  address: string
  @Column()
  contract_address: string
}

import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Contract {
  @PrimaryColumn({ unique: true })
  address: string
  @Column()
  contract_type: string
}

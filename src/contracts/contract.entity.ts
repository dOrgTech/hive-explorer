import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Contract {
  @PrimaryColumn({ unique: true })
  address: string
  @Column()
  type: string
}

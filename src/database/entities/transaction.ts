import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './user'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  amount: number

  @Column({ default: 'EUR' })
  currency: string

  @Column({ enum: ['deposit', 'withdrawal', 'ticket_purchased'] })
  type: string

  @Column()
  date: Date

  @ManyToOne(() => User, (user) => user.transactions)
  user: User
}

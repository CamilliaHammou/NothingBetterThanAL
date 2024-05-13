import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RefreshToken } from './refreshToken'
import { Transaction } from './transaction'
import { Ticket } from './ticket'
import { EmployeeSchedule } from './employeeSchedule'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: 'client' })
  role: string // 'client', 'projectionist', 'reception', 'confectionery', 'admin', 'super_admin'

  @Column({ default: 0 })
  balance: number

  @Column({ default: 'EUR' })
  currency: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[]

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[]

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[]

  @OneToMany(() => EmployeeSchedule, (schedule) => schedule.employee)
  schedules: EmployeeSchedule[]
}

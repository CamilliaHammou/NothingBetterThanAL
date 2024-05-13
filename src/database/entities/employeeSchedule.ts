import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './user'

@Entity()
export class EmployeeSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  employeeId: string

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'employeeId' })
  employee: User

  @Column('time')
  startTime: string

  @Column('time')
  endTime: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @Column()
  date: Date
}

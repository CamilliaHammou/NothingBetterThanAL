import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from './user'
import { SessionAttendance } from './sessionAttendance'

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ enum: ['regular', 'super'] })
  type: string // 'regular', 'super'

  @Column()
  purchaseDate: Date

  @ManyToOne(() => User, (user) => user.tickets)
  user: User

  @OneToMany(
    () => SessionAttendance,
    (sessionAttendance) => sessionAttendance.ticket
  )
  attendances: SessionAttendance[]
}

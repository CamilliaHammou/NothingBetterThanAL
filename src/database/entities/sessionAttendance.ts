import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Session } from './session'
import { Ticket } from './ticket'

@Entity()
export class SessionAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Session, (session) => session.attendances)
  @JoinColumn()
  session: Session

  @ManyToOne(() => Ticket, (ticket) => ticket.attendances)
  @JoinColumn()
  ticket: Ticket
}

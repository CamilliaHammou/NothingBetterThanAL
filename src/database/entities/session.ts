import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { Hall } from './hall'
import { Movie } from './movie'
import { SessionAttendance } from './sessionAttendance'

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column({
    type: 'enum',
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  })
  status: string

  @ManyToOne(() => Hall, (hall) => hall.sessions)
  hall: Hall

  @ManyToOne(() => Movie, (movie) => movie.sessions)
  movie: Movie

  @OneToMany(
    () => SessionAttendance,
    (sessionAttendance) => sessionAttendance.session
  )
  attendances: SessionAttendance[]
}

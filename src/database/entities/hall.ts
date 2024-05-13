import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Session } from './session'
import { HallImage } from './hallImage'

@Entity({ name: 'room' })
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  type: string

  @Column()
  capacity: number

  @Column()
  accessibility: boolean

  @Column({ default: false })
  maintenance: boolean

  @OneToMany(() => HallImage, (hallImage) => hallImage.hall)
  images: HallImage[]

  @OneToMany(() => Session, (session) => session.hall)
  sessions: Session[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

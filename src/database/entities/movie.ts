import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Session } from './session'
import { MovieImage } from './movieImage'

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  duration: number

  @OneToMany(() => MovieImage, (movieImage) => movieImage.movie)
  images: MovieImage[]

  @OneToMany(() => Session, (session) => session.movie)
  sessions: Session[]
}

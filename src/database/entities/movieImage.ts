import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Movie } from './movie'

@Entity()
export class MovieImage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'blob',
  })
  image: Buffer

  @ManyToOne(() => Movie, (movie) => movie.images)
  movie: Movie
}

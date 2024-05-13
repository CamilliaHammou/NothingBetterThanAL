import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Hall } from './hall'

@Entity()
export class HallImage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'blob',
  })
  image: Buffer

  @ManyToOne(() => Hall, (hall) => hall.images)
  hall: Hall
}

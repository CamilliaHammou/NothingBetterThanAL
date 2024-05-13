export interface CreateHallDto {
  name: string
  description: string
  type: string
  capacity: number
  accessibility: boolean
  images?: Express.Multer.File[]
}

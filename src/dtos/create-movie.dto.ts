export interface CreateMovieDto {
  title: string
  description: string
  duration: number
  images?: Express.Multer.File[]
}

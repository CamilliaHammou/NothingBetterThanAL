export interface CreateSessionDto {
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'canceled'
  hallId: string
  movieId: string
}

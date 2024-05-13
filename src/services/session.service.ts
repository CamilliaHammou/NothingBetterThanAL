import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm'
import { Session } from '../database/entities/session'
import { Hall } from '../database/entities/hall'
import { Movie } from '../database/entities/movie'
import { CreateSessionDto } from '../dtos/create-session.dto'
import ApiError from '../utils/apiError'

@injectable()
export class SessionService {
  constructor(
    @inject(TYPES.SessionRepository)
    private sessionRepository: Repository<Session>,
    @inject(TYPES.HallRepository) private hallRepository: Repository<Hall>,
    @inject(TYPES.MovieRepository) private movieRepository: Repository<Movie>
  ) {}

  async createSession(data: CreateSessionDto) {
    const { startTime, endTime, hallId, movieId } = data

    const hall = await this.hallRepository.findOneBy({ id: hallId })
    if (!hall) throw new ApiError(404, 'Hall not found')

    const movie = await this.movieRepository.findOneBy({ id: movieId })
    if (!movie) throw new ApiError(404, 'Movie not found')

    //startTime and endTime are ISO string
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)

    //Cinema open hours: 9:00 AM to 8:00 PM
    const cinemaOpens = new Date(startDateTime)
    cinemaOpens.setHours(9, 0, 0, 0) // 9:00 AM

    const cinemaCloses = new Date(endDateTime)
    cinemaCloses.setHours(20, 0, 0, 0) // 8:00 PM

    //we check if session is within cinema open hours
    if (
      startDateTime < cinemaOpens ||
      endDateTime > cinemaCloses ||
      endDateTime < startDateTime
    ) {
      throw new ApiError(
        400,
        'Session must be scheduled within cinema open hours (9:00 AM to 8:00 PM) and end time must be after start time.'
      )
    }

    const sessionDuration =
      (endDateTime.getTime() - startDateTime.getTime()) / 60000
    if (sessionDuration < movie.duration + 30) {
      throw new ApiError(
        400,
        'Session duration must be at least half-hour longer than movie duration.'
      )
    }

    //we check for overlapping sessions in the same hall
    const overlappingSessionsInHall = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.hall', 'hall')
      .where('hall.id = :hallId', { hallId: hallId })
      .andWhere('session.startTime <= :endDateTime', {
        endDateTime: endDateTime,
      })
      .andWhere('session.endTime >= :startDateTime', {
        startDateTime: startDateTime,
      })
      .getMany()

    if (overlappingSessionsInHall.length > 0) {
      throw new ApiError(
        400,
        'There is already a session scheduled in this hall during the requested time.'
      )
    }

    //we check for sessions of the movie in any other hall at the same time
    const overlappingMovieSessions = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.movie', 'movie')
      .leftJoinAndSelect('session.hall', 'hall')
      .where('movie.id = :movieId', { movieId: movieId })
      .andWhere('session.startTime <= :endDateTime', {
        endDateTime: endDateTime,
      })
      .andWhere('session.endTime >= :startDateTime', {
        startDateTime: startDateTime,
      })
      .getMany()

    if (overlappingMovieSessions.length > 0) {
      throw new ApiError(
        400,
        'This movie is already playing in another hall at the same time.'
      )
    }

    return this.sessionRepository.save({
      startTime,
      endTime,
      status: 'scheduled',
      hall,
      movie,
    })
  }

  async updateSession(sessionId: string, data: CreateSessionDto) {
    const { startTime, endTime, hallId, movieId } = data
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    })
    if (!session) throw new ApiError(404, 'Session not found')

    const hall = await this.hallRepository.findOneBy({ id: hallId })
    if (!hall) throw new ApiError(404, 'Hall not found')

    const movie = await this.movieRepository.findOneBy({ id: movieId })
    if (!movie) throw new ApiError(404, 'Movie not found')

    //startTime and endTime are ISO string
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)

    //cinema open hours: 9:00 AM to 8:00 PM
    const cinemaOpens = new Date(startDateTime)
    cinemaOpens.setHours(9, 0, 0, 0) // 9:00 AM

    const cinemaCloses = new Date(endDateTime)
    cinemaCloses.setHours(20, 0, 0, 0) // 8:00 PM

    //we check if session is within cinema open hours
    if (
      startDateTime < cinemaOpens ||
      endDateTime > cinemaCloses ||
      endDateTime < startDateTime
    ) {
      throw new ApiError(
        400,
        'Session must be scheduled within cinema open hours (9:00 AM to 8:00 PM) and end time must be after start time.'
      )
    }

    const sessionDuration =
      (endDateTime.getTime() - startDateTime.getTime()) / 60000
    if (sessionDuration < movie.duration + 30) {
      throw new ApiError(
        400,
        'Session duration must be at least half-hour longer than movie duration.'
      )
    }
    const updated = await this.sessionRepository.save({
      ...session,
      startTime,
      endTime,
      hall,
      movie,
    })
    return updated
  }
  async getSessionsPaginated(page: number = 1, limit: number = 10) {
    const [result, total] = await this.sessionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['movie', 'hall'],
    })
    return {
      data: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
  async getSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['hall', 'movie'],
    })
    if (!session) throw new ApiError(404, 'Session not found')
    return session
  }
  async deleteSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    })
    if (!session) throw new ApiError(404, 'Session not found')
    await this.sessionRepository.remove(session)
    return { message: 'Session deleted successfully' }
  }
}

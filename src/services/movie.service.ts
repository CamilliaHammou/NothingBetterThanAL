import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { Repository } from 'typeorm'
import { Movie } from '../database/entities/movie'
import { MovieImage } from '../database/entities/movieImage'
import { CreateMovieDto } from '../dtos/create-movie.dto'
import ApiError from '../utils/apiError'
import { UpdateMovieDto } from '../dtos/update-movie.dto'
import { Session } from '../database/entities/session'

@injectable()
export class MovieService {
  constructor(
    @inject(TYPES.MovieRepository) private movieRepository: Repository<Movie>,
    @inject(TYPES.MovieImageRepository)
    private movieImageRepository: Repository<MovieImage>,
    @inject(TYPES.SessionRepository)
    private sessionRepository: Repository<Session>
  ) {}

  async createMovie(movieData: CreateMovieDto) {
    const { images, ...data } = movieData
    const movie = await this.movieRepository.save({ ...data })
    let imgs
    if (images && images.length > 0) {
      const movieImages = images.map((file) => {
        const newHallImage = { movie, image: file.buffer }
        return newHallImage
      })
      imgs = await this.movieImageRepository.save(movieImages)
      return imgs
    }

    return { movie }
  }

  async updateMovie(movieId: string, updatedMovieData: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } })
    if (!movie) throw new ApiError(404, 'Movie not found')
    const updated = await this.movieRepository.save({
      ...movie,
      ...updatedMovieData,
    })
    return updated
  }

  async addNewImage(movieId: string, image: Express.Multer.File) {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } })
    if (!movie) throw new ApiError(404, 'Movie not found')
    return this.movieImageRepository.save({ movie, image: image.buffer })
  }

  async removeExistingImage(imageId: string) {
    const image = await this.movieImageRepository.findOne({
      where: { id: imageId },
    })
    if (!image) throw new ApiError(404, 'Image not found')
    await this.movieImageRepository.remove(image)
    return { message: 'Image removed successfully' }
  }

  async getMoviesPaginated(page: number = 1, limit: number = 10) {
    const [result, total] = await this.movieRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['images'], //assuming we want to fetch related images too
    })
    return {
      data: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getMovie(movieId: string) {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: ['images'],
    })
    if (!movie) throw new ApiError(404, 'Movie not found')
    return movie
  }

  async deleteMovie(movieId: string) {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } })
    if (!movie) throw new ApiError(404, 'Movie not found')

    //option
    await this.movieImageRepository.delete({ movie: { id: movieId } })

    await this.movieRepository.remove(movie)
    return { message: 'Movie deleted successfully' }
  }

  async getMovieSessions(data: {
    movieId: string
    startDate: string
    endDate: string
    status: string
  }) {
    const { movieId, startDate, endDate, status } = data
    const query = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.movie', 'movie')
      .leftJoinAndSelect('session.hall', 'hall')
      .where('session.movieId = :movieId', { movieId })

    if (startDate) {
      const start = new Date(startDate)
      query.andWhere('session.startTime >= :startDate', { startDate: start })
    }

    if (endDate) {
      const end = new Date(endDate)
      query.andWhere('session.startTime <= :endDate', { endDate: end })
    }

    if (status) {
      query.andWhere('session.status = :status', { status })
    }

    return query.getMany()
  }
}

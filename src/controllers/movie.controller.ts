import { injectable } from 'inversify'
import { MovieService } from '../services/movie.service'
import { Request, Response } from 'express'
import { createMovieSchema } from '../validators/create-movie.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'
import { updateMovieSchema } from '../validators/update-movie.validator'

@injectable()
export class MovieController {
  constructor(private movieService: MovieService) {}

  async create(req: Request, res: Response) {
    const { value, error } = createMovieSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }

    const movie = await this.movieService.createMovie({
      ...value,
      images: req.files,
    })
    res.json(movie)
  }

  async update(req: Request, res: Response) {
    const { value, error } = updateMovieSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const movie = await this.movieService.updateMovie(req.params.id, value)
    res.json(movie)
  }

  async addImage(req: Request, res: Response) {
    const result = await this.movieService.addNewImage(
      req.params.id,
      req.file as Express.Multer.File
    )
    res.json(result)
  }

  async removeImage(req: Request, res: Response) {
    await this.movieService.removeExistingImage(req.params.imageId)
    res.json({ message: 'Image removed successfully' })
  }

  async getPaginated(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const result = await this.movieService.getMoviesPaginated(page, limit)
    res.json(result)
  }

  async getSingle(req: Request, res: Response) {
    const movie = await this.movieService.getMovie(req.params.id)
    res.json(movie)
  }

  async delete(req: Request, res: Response) {
    await this.movieService.deleteMovie(req.params.id)
    res.json({ message: 'Movie deleted successfully' })
  }

  async getSessions(req: Request, res: Response) {
    const { startDate, endDate, status } = req.query
    const result = await this.movieService.getMovieSessions({
      movieId: req.params.id,
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
    })

    res.json(result)
  }
}

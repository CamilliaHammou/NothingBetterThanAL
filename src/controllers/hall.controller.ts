import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { createHallSchema } from '../validators/create-hall.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'
import { HallService } from '../services/hall.service'
import { updateHallSchema } from '../validators/update-hall.validator'

@injectable()
export class HallController {
  constructor(private hallService: HallService) {}
  async create(req: Request, res: Response) {
    const { value, error } = createHallSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const hall = await this.hallService.createHall({
      ...value,
      images: req.files,
    })
    res.json(hall)
  }

  async update(req: Request, res: Response) {
    const { value, error } = updateHallSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const hall = await this.hallService.updateHall(req.params.id, value)
    res.json(hall)
  }

  async addImage(req: Request, res: Response) {
    const result = await this.hallService.addNewImage(
      req.params.id,
      req.file as Express.Multer.File
    )
    res.json(result)
  }

  async removeImage(req: Request, res: Response) {
    await this.hallService.removeExistingImage(req.params.imageId)
    res.json({ message: 'Image removed successfully' })
  }

  async getSingle(req: Request, res: Response) {
    const hall = await this.hallService.getSingleHall(req.params.id)
    res.json(hall)
  }

  async getPaginated(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const result = await this.hallService.getHallsPaginated(page, limit)
    res.json(result)
  }

  async delete(req: Request, res: Response) {
    await this.hallService.deleteHall(req.params.id)
    res.json({ message: 'Hall deleted successfully' })
  }

  async getHallSessions(req: Request, res: Response) {
    const { startDate, endDate, status } = req.query
    const result = await this.hallService.getHallSessions({
      hallId: req.params.id,
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
    })

    res.json(result)
  }
}

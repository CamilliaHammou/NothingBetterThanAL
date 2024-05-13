import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { Repository } from 'typeorm'
import { Hall } from '../database/entities/hall'
import { CreateHallDto } from '../dtos/create-hall.dto'
import { HallImage } from '../database/entities/hallImage'
import ApiError from '../utils/apiError'
import { UpdateHallDto } from '../dtos/update-hall.dto'
import { Session } from '../database/entities/session'

@injectable()
export class HallService {
  constructor(
    @inject(TYPES.HallRepository) private hallRepository: Repository<Hall>,
    @inject(TYPES.HallImageRepository)
    private hallImageRepository: Repository<HallImage>,
    @inject(TYPES.SessionRepository)
    private sessionRepository: Repository<Session>
  ) {}

  async createHall(data: CreateHallDto) {
    const { images, ...hallData } = data
    const hall = await this.hallRepository.save({ ...hallData })
    let imgs
    if (images && images.length > 0) {
      const hallImages = images.map((file) => {
        const newHallImage = { hall, image: file.buffer }
        return newHallImage
      })
      imgs = await this.hallImageRepository.save(hallImages)
      return imgs
    }
    return { hall }
  }

  async updateHall(hallId: string, updatedHallData: UpdateHallDto) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } })
    if (!hall) throw new ApiError(404, 'Hall not found')

    const updated = await this.hallRepository.save({
      ...hall,
      ...updatedHallData,
    })
    return updated
  }

  async addNewImage(hallId: string, image: Express.Multer.File) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } })
    if (!hall) throw new ApiError(404, 'Hall not found')
    return this.hallImageRepository.save({ hall, image: image.buffer })
  }

  async removeExistingImage(imageId: string) {
    const image = await this.hallImageRepository.findOne({
      where: { id: imageId },
    })
    if (!image) throw new ApiError(404, 'Image not found')
    await this.hallImageRepository.remove(image)
    return { message: 'Image removed successfully' }
  }

  async getHallsPaginated(page: number = 1, limit: number = 10) {
    const [result, total] = await this.hallRepository.findAndCount({
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

  async getSingleHall(hallId: string) {
    const hall = await this.hallRepository.findOne({
      where: { id: hallId },
      relations: ['images'],
    })
    if (!hall) throw new ApiError(404, 'Hall not found')
    return hall
  }

  async deleteHall(hallId: string) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } })
    if (!hall) throw new ApiError(404, 'Hall not found')

    //option
    await this.hallImageRepository.delete({ hall: { id: hallId } })

    await this.hallRepository.remove(hall)
    return { message: 'Hall deleted successfully' }
  }

  async getHallSessions(data: {
    hallId: string
    startDate: string
    endDate: string
    status: string
  }) {
    const { hallId, startDate, endDate, status } = data
    const query = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.hall', 'hall')
      .leftJoinAndSelect('session.movie', 'movie')
      .where('session.hallId = :hallId', { hallId })

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

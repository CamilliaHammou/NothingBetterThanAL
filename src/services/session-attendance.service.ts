import { inject, injectable } from 'inversify'
import ApiError from '../utils/apiError'
import { TYPES } from '../config/types'
import { SessionAttendance } from '../database/entities/sessionAttendance'
import { Between, Repository } from 'typeorm'
import { Ticket } from '../database/entities/ticket'
import { Session } from '../database/entities/session'

@injectable()
export class SessionAttendanceService {
  constructor(
    @inject(TYPES.SessionAttendanceRepository)
    private sessionAttendanceRepository: Repository<SessionAttendance>,
    @inject(TYPES.TicketRepository)
    private ticketRepository: Repository<Ticket>,
    @inject(TYPES.SessionRepository)
    private sessionRepository: Repository<Session>
  ) {}

  async attend(sessionId: string, ticketId: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['attendances'],
    })
    if (!ticket) {
      throw new ApiError(404, 'Ticket not found.')
    }
    if (ticket.type === 'super' && ticket.attendances.length === 10) {
      throw new ApiError(400, 'Ticket has reached its limit')
    }
    if (ticket.type === 'regular' && ticket.attendances.length === 1) {
      throw new ApiError(400, 'Ticket has reached its limit')
    }
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    })
    if (!session) {
      throw new ApiError(400, 'Session not found.')
    }
    if (session.status === 'cancelled') {
      throw new ApiError(400, 'This session has been cancelled.')
    }

    const attendance = await this.sessionAttendanceRepository.save({
      ticket,
      session,
    })
    return attendance
  }

  async getHallAttendance(hallId: string, startDate: string, endDate: string) {
    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.attendances', 'attendance')
      .where('session.hallId = :hallId', { hallId })
      .andWhere('session.startTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany()

    const attendanceData = sessions.map((session) => ({
      sessionId: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      attendanceCount: session.attendances.length,
    }))
    return {
      hallId,
      attendanceData,
      totalAttendance: attendanceData.reduce(
        (acc, cur) => acc + cur.attendanceCount,
        0
      ),
    }
  }

  async getSessionAttendance(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['attendances'],
    })

    if (!session) {
      throw new ApiError(404, 'Session not found.')
    }

    return {
      sessionId,
      attendanceCount: session.attendances.length,
    }
  }
  async getTotalAttendance(startDate: string, endDate: string) {
    const start = new Date(startDate)
    console.log(start)
    const end = new Date(endDate)
    const sessions = await this.sessionRepository.find({
      where: {
        startTime: Between(start, end),
      },
      relations: ['attendances'],
    })
    console.log(sessions)
    const overallAttendance = sessions.reduce(
      (acc, session) => acc + session.attendances.length,
      0
    )

    return {
      startDate,
      endDate,
      overallAttendance,
    }
  }
}

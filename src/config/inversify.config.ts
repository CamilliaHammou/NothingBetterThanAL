import { Container } from 'inversify'
import { TYPES } from './types'

// datasource and entities
import AppDataSource from '../database/database'
import { User } from '../database/entities/user'
import { RefreshToken } from '../database/entities/refreshToken'
import { Hall } from '../database/entities/hall'
import { HallImage } from '../database/entities/hallImage'
import { Movie } from '../database/entities/movie'
import { MovieImage } from '../database/entities/movieImage'
import { Session } from '../database/entities/session'
import { Transaction } from '../database/entities/transaction'
import { Ticket } from '../database/entities/ticket'
import { SessionAttendance } from '../database/entities/sessionAttendance'

// controllers
import { UserController } from '../controllers/user.controller'
import { HallController } from '../controllers/hall.controller'
import { MovieController } from '../controllers/movie.controller'
import { SessionController } from '../controllers/session.controller'
import { TransactionController } from '../controllers/transaction.controller'
import { SessionAttendanceController } from '../controllers/session-attendance.controller'
import { EmployeeScheduleController } from '../controllers/employee-schedule.controller'
import { TicketController } from '../controllers/ticket.controller'

// services
import { UserService } from '../services/user.service'
import { HallService } from '../services/hall.service'
import { MovieService } from '../services/movie.service'
import { SessionService } from '../services/session.service'
import { TransactionService } from '../services/transaction.service'
import { SessionAttendanceService } from '../services/session-attendance.service'
import { EmployeeScheduleService } from '../services/employee-schedule.service'
import { EmployeeSchedule } from '../database/entities/employeeSchedule'
import { TicketService } from '../services/ticket.service'

const container = new Container()

// controllers
container.bind(UserController).toSelf()
container.bind(HallController).toSelf()
container.bind(MovieController).toSelf()
container.bind(SessionController).toSelf()
container.bind(TicketController).toSelf()
container.bind(TransactionController).toSelf()
container.bind(SessionAttendanceController).toSelf()
container.bind(EmployeeScheduleController).toSelf()

// services
container.bind(UserService).toSelf()
container.bind(HallService).toSelf()
container.bind(MovieService).toSelf()
container.bind(SessionService).toSelf()
container.bind(TicketService).toSelf()
container.bind(TransactionService).toSelf()
container.bind(SessionAttendanceService).toSelf()
container.bind(EmployeeScheduleService).toSelf()

// repositories
container
  .bind(TYPES.UserRepository)
  .toConstantValue(AppDataSource.getRepository(User))
container
  .bind(TYPES.RefreshTokenRepository)
  .toConstantValue(AppDataSource.getRepository(RefreshToken))
container
  .bind(TYPES.HallRepository)
  .toConstantValue(AppDataSource.getRepository(Hall))
container
  .bind(TYPES.HallImageRepository)
  .toConstantValue(AppDataSource.getRepository(HallImage))
container
  .bind(TYPES.MovieRepository)
  .toConstantValue(AppDataSource.getRepository(Movie))
container
  .bind(TYPES.MovieImageRepository)
  .toConstantValue(AppDataSource.getRepository(MovieImage))
container
  .bind(TYPES.SessionRepository)
  .toConstantValue(AppDataSource.getRepository(Session))
container
  .bind(TYPES.TransactionRepository)
  .toConstantValue(AppDataSource.getRepository(Transaction))
container
  .bind(TYPES.TicketRepository)
  .toConstantValue(AppDataSource.getRepository(Ticket))
container
  .bind(TYPES.SessionAttendanceRepository)
  .toConstantValue(AppDataSource.getRepository(SessionAttendance))
container
  .bind(TYPES.EmployeeScheduleRepository)
  .toConstantValue(AppDataSource.getRepository(EmployeeSchedule))

export { container }

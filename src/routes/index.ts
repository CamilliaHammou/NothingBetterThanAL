import express, { Request, Response } from 'express'
import userRoutes from './user.routes'
import hallRoutes from './hall.routes'
import movieRoutes from './movie.routes'
import sessionRoutes from './session.routes'
import ticketRoutes from './ticket.routes'
import transactionRoutes from './transaction.routes'
import sessionAttendanceRoutes from './session-attendance.routes'
import employeeScheduleRoutes from './employee-schedule.routes'

export const initRoutes = (app: express.Express) => {
  app.get('/health', (req: Request, res: Response) => {
    res.send({ message: 'Cinema: Nothingbetterthanal' })
  })
  app.use('/users', userRoutes)
  app.use('/halls', hallRoutes)
  app.use('/movies', movieRoutes)
  app.use('/sessions', sessionRoutes)
  app.use('/tickets', ticketRoutes)
  app.use('/transactions', transactionRoutes)
  app.use('/attendances', sessionAttendanceRoutes)
  app.use('/employees-schedule', employeeScheduleRoutes)
}

import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import express from 'express'
import { initRoutes } from './routes'
import AppDataSource from './database/database'
import cookieParser from 'cookie-parser'
import { errorHandler, notFound } from './middlewares/error.middleware'
import swaggerUi from 'swagger-ui-express';
import specs from '../swaggerConfig';

const main = async () => {
  const app = express()
  const port = 3000

  try {
    await AppDataSource.initialize()
    console.error('well connected to database')
  } catch (error) {
    console.log(error)
    console.error('Cannot contact database')
    process.exit(1)
  }

  // swagger use
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.use(express.json())
  app.use(cookieParser())
  initRoutes(app)
  app.use(notFound)
  app.use(errorHandler)
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

main()

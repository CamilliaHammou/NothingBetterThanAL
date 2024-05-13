import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'

import { EmployeeScheduleController } from '../controllers/employee-schedule.controller'

const router = express.Router()

const employeeScheduleController = container.get(EmployeeScheduleController)

/**
 * @swagger
 * /employee-schedule:
 *  post:
 *    summary: Create a new employee schedule
 *    description: This endpoint creates a new employee schedule
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Employee Schedule
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              employeeId:
 *                type: string
 *              startTime:
 *                type: string
 *                format: date-time
 *              endTime:
 *                type: string
 *                format: date-time
 *              date:
 *                type: string
 *                format: date
 *              description:
 *                type: string
 *            required:
 *              - employeeId
 *              - startDate
 *              - endDate
 *    responses:
 *      '201':
 *        description: Successfully created a new employee schedule
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/',
  authenticate,
  authorize([userTypes.SUPER_ADMIN]),
  asyncHandler(
    employeeScheduleController.create.bind(employeeScheduleController)
  )
)

/**
 * @swagger
 * /employee-schedule/self:
 *  get:
 *    summary: Get the current user's schedule
 *    description: This endpoint returns the schedule for the currently authenticated user
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Employee Schedule
 *    parameters:
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *          format: date-time
 *        description: The start date of the schedule
 *      - in: query
 *        name: endDate
 *        schema:
 *          type: string
 *          format: date-time
 *        description: The end date of the schedule
 *    responses:
 *      '200':
 *        description: Successfully retrieved the user's schedule
 *      '400':
 *        description: Invalid request parameters
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/self',
  authenticate,
  authorize([
    userTypes.CONFECTIONERY,
    userTypes.PROJECTIONIST,
    userTypes.RECEPTION,
  ]),
  asyncHandler(
    employeeScheduleController.getSelfSchedule.bind(employeeScheduleController)
  )
)

/**
 * @swagger
 * /employee-schedule/{id}:
 *  get:
 *    summary: Get an employee's schedule
 *    description: This endpoint returns the schedule for a specific employee
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Employee Schedule
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the employee
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *          format: date-time
 *        description: The start date of the schedule
 *      - in: query
 *        name: endDate
 *        schema:
 *          type: string
 *          format: date-time
 *        description: The end date of the schedule
 *    responses:
 *      '200':
 *        description: Successfully retrieved the employee's schedule
 *      '400':
 *        description: Invalid request parameters
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/employee/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN]),
  asyncHandler(
    employeeScheduleController.getEmployeeSchedule.bind(
      employeeScheduleController
    )
  )
)
export default router

import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'
import { SessionAttendanceController } from '../controllers/session-attendance.controller'

const router = express.Router()

const sessionAttendanceController = container.get(SessionAttendanceController)

/**
 * @swagger
 * /attendances/attend:
 *  post:
 *    summary: Attend a session
 *    description: This endpoint allows a user to attend a session
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Attendance
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sessionId:
 *                type: string
 *              ticketId:
 *                type: string
 *            required:
 *              - sessionId
 *              - ticketId
 *    responses:
 *      '201':
 *        description: Successfully attended a session
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/attend',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.RECEPTION]),
  asyncHandler(
    sessionAttendanceController.attend.bind(sessionAttendanceController)
  )
)

/**
 * @swagger
 * /attendances/hall/{id}:
 *  get:
 *    summary: Get hall attendance
 *    description: This endpoint returns the attendance of a specific hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Attendance
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the hall to retrieve attendance for
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *          format: date-time
 *        required: false
 *        description: The start date of the period to retrieve attendance for
 *      - in: query
 *        name: endDate
 *        schema:
 *          type: string
 *          format: date-time
 *        required: false
 *        description: The end date of the period to retrieve attendance for
 *    responses:
 *      '200':
 *        description: Successfully retrieved the hall's attendance
 *      '404':
 *        description: Hall not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/hall/:id',
  authenticate,
  authorize([
    userTypes.SUPER_ADMIN,
    userTypes.ADMIN,
    userTypes.RECEPTION,
    userTypes.CONFECTIONERY,
    userTypes.PROJECTIONIST,
  ]),
  asyncHandler(
    sessionAttendanceController.getHallAttendance.bind(
      sessionAttendanceController
    )
  )
)

/**
 * @swagger
 * /attendances/session/{id}:
 *  get:
 *    summary: Get session attendance
 *    description: This endpoint returns the attendance of a specific session
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Attendance
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the session to retrieve attendance for
 *    responses:
 *      '200':
 *        description: Successfully retrieved the session's attendance
 *      '404':
 *        description: Session not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/session/:id',
  authenticate,
  authorize([
    userTypes.SUPER_ADMIN,
    userTypes.ADMIN,
    userTypes.RECEPTION,
    userTypes.CONFECTIONERY,
    userTypes.PROJECTIONIST,
  ]),
  asyncHandler(
    sessionAttendanceController.getSessionAttendance.bind(
      sessionAttendanceController
    )
  )
)

/**
 * @swagger
 * /attendances/overview:
 *  get:
 *    summary: Get total attendance
 *    description: This endpoint returns the total attendance over a specific period
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Attendance
 *    parameters:
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *          format: date-time
 *        required: false
 *        description: The start date of the period to retrieve attendance for
 *      - in: query
 *        name: endDate
 *        schema:
 *          type: string
 *          format: date-time
 *        required: false
 *        description: The end date of the period to retrieve attendance for
 *    responses:
 *      '200':
 *        description: Successfully retrieved the total attendance
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/overview',
  authenticate,
  authorize([
    userTypes.SUPER_ADMIN,
    userTypes.ADMIN,
    userTypes.RECEPTION,
    userTypes.CONFECTIONERY,
    userTypes.PROJECTIONIST,
  ]),
  asyncHandler(
    sessionAttendanceController.getTotalAttendance.bind(
      sessionAttendanceController
    )
  )
)

export default router

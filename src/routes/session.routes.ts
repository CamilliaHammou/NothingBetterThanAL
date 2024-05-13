import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'

import { SessionController } from '../controllers/session.controller'

const router = express.Router()

const sessionController = container.get(SessionController)

/**
 * @swagger
 * /sessions:
 *  get:
 *    summary: Get paginated sessions
 *    description: This endpoint returns paginated sessions
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Session
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: The page number to retrieve
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: The number of sessions to retrieve per page
 *    responses:
 *      '200':
 *        description: Successfully retrieved sessions
 *      '400':
 *        description: Invalid query parameters
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/',
  authenticate,
  asyncHandler(sessionController.getPaginated.bind(sessionController))
)

/**
 * @swagger
 * /sessions:
 *  post:
 *    summary: Create a session
 *    description: This endpoint creates a session
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              startTime:
 *                type: string
 *              endTime:
 *                type: string
 *              status:
 *                type: string
 *                enum: ['scheduled', 'completed', 'canceled']
 *              hallId:
 *                type: string
 *              movieId:
 *                type: string
 *            required:
 *              - startTime
 *              - endTime
 *              - status
 *              - hallId
 *              - movieId
 *    responses:
 *      '201':
 *        description: Successfully created a session
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(sessionController.create.bind(sessionController))
)

/**
 * @swagger
 * /sessions/{id}:
 *  get:
 *    summary: Get a single session
 *    description: This endpoint returns a single session by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Session
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the session to retrieve
 *    responses:
 *      '200':
 *        description: Successfully retrieved the session
 *      '404':
 *        description: Session not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(sessionController.getSingle.bind(sessionController))
)

/**
 * @swagger
 * /sessions/{id}:
 *  put:
 *    summary: Update a session
 *    description: This endpoint updates a session by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Session
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the session to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              startTime:
 *                type: string
 *              endTime:
 *                type: string
 *              status:
 *                type: string
 *                enum: ['scheduled', 'completed', 'canceled']
 *              hallId:
 *                type: string
 *              movieId:
 *                type: string
 *            required:
 *              - startTime
 *              - endTime
 *              - status
 *              - hallId
 *              - movieId
 *    responses:
 *      '200':
 *        description: Successfully updated the session
 *      '400':
 *        description: Invalid request body
 *      '404':
 *        description: Session not found
 *      '500':
 *        description: Internal server error
 */
router.put(
  '/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(sessionController.update.bind(sessionController))
)

/**
 * @swagger
 * /sessions/{id}:
 *  delete:
 *    summary: Delete a session
 *    description: This endpoint deletes a session by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Session
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the session to delete
 *    responses:
 *      '200':
 *        description: Successfully deleted the session
 *      '404':
 *        description: Session not found
 *      '500':
 *        description: Internal server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(sessionController.delete.bind(sessionController))
)

export default router

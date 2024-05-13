import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'
import { HallController } from '../controllers/hall.controller'
import {
  uploadMultiple,
  uploadSingle,
} from '../middlewares/image-upload.middleware'

const router = express.Router()

const hallController = container.get(HallController)

/**
 * @swagger
 * /halls:
 *  get:
 *    summary: Get paginated list of halls
 *    description: This endpoint returns a paginated list of halls
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
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
 *        description: The number of halls to retrieve per page
 *    responses:
 *      '200':
 *        description: Successfully retrieved the list of halls
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/',
  authenticate,
  asyncHandler(hallController.getPaginated.bind(hallController))
)

/**
 * @swagger
 * /halls:
 *  post:
 *    summary: Create a new hall
 *    description: This endpoint creates a new hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              type:
 *                type: string
 *              capacity:
 *                type: number
 *              accessibility:
 *                type: boolean
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *            required:
 *              - name
 *              - description
 *              - type
 *              - capacity
 *              - accessibility
 *    responses:
 *      '201':
 *        description: Successfully created a new hall
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  uploadMultiple,
  asyncHandler(hallController.create.bind(hallController))
)

/**
 * @swagger
 * /halls/{id}:
 *  get:
 *    summary: Get a single hall
 *    description: This endpoint returns a single hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the hall to retrieve
 *    responses:
 *      '200':
 *        description: Successfully retrieved a hall
 *      '404':
 *        description: Hall not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(hallController.getSingle.bind(hallController))
)

/**
 * @swagger
 * /halls/{id}:
 *  put:
 *    summary: Update a hall
 *    description: This endpoint updates a hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the hall to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              type:
 *                type: string
 *              capacity:
 *                type: number
 *              accessibility:
 *                type: boolean
 *              maintenance:
 *                type: boolean
 *            required:
 *              - name
 *              - description
 *              - type
 *              - capacity
 *              - accessibility
 *              - maintenance
 *    responses:
 *      '200':
 *        description: Successfully updated a hall
 *      '400':
 *        description: Invalid request body
 *      '404':
 *        description: Hall not found
 *      '500':
 *        description: Internal server error
 */
router.put(
  '/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(hallController.update.bind(hallController))
)

/**
 * @swagger
 * /halls/{id}/add-image:
 *  patch:
 *    summary: Add an image to a hall
 *    description: This endpoint adds an image to a hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the hall to add an image to
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *            required:
 *              - image
 *    responses:
 *      '200':
 *        description: Successfully added an image to a hall
 *      '400':
 *        description: Invalid request body
 *      '404':
 *        description: Hall not found
 *      '500':
 *        description: Internal server error
 */
router.patch(
  '/:id/add-image',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  uploadSingle,
  asyncHandler(hallController.addImage.bind(hallController))
)

/**
 * @swagger
 * /halls/remove-image/{imageId}:
 *  delete:
 *    summary: Remove an image from a hall
 *    description: This endpoint removes an image from a hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    parameters:
 *      - in: path
 *        name: imageId
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the image to remove
 *    responses:
 *      '200':
 *        description: Successfully removed an image from a hall
 *      '404':
 *        description: Image not found
 *      '500':
 *        description: Internal server error
 */
router.delete(
  '/remove-image/:imageId',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(hallController.removeImage.bind(hallController))
)

/**
 * @swagger
 * /halls/{id}:
 *  delete:
 *    summary: Delete a hall
 *    description: This endpoint deletes a hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the hall to delete
 *    responses:
 *      '200':
 *        description: Successfully deleted a hall
 *      '404':
 *        description: Hall not found
 *      '500':
 *        description: Internal server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(hallController.delete.bind(hallController))
)

/**
 * @swagger
 * /halls/{id}/sessions:
 *  get:
 *    summary: Get sessions for a hall
 *    description: This endpoint returns sessions for a hall
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Hall
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the hall to get sessions for
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *          format: date-time
 *        description: The start date of the sessions
 *      - in: query
 *        name: endDate
 *        schema:
 *          type: string
 *          format: date-time
 *        description: The end date of the sessions
 *    responses:
 *      '200':
 *        description: Successfully retrieved sessions for a hall
 *      '404':
 *        description: Hall not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/:id/sessions',
  authenticate,
  asyncHandler(hallController.getHallSessions.bind(hallController))
)

export default router

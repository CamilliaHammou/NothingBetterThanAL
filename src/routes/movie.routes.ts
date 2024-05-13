import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'
import { MovieController } from '../controllers/movie.controller'
import {
  uploadMultiple,
  uploadSingle,
} from '../middlewares/image-upload.middleware'

const router = express.Router()

const movieController = container.get(MovieController)

/**
 * @swagger
 * /movies:
 *  get:
 *    summary: Get paginated movies
 *    description: This endpoint returns paginated movies
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
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
 *        description: The number of movies to retrieve per page
 *    responses:
 *      '200':
 *        description: Successfully retrieved movies
 *      '400':
 *        description: Invalid query parameters
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/',
  authenticate,
  asyncHandler(movieController.getPaginated.bind(movieController))
)

/**
 * @swagger
 * /movies:
 *  post:
 *    summary: Create a movie
 *    description: This endpoint creates a movie
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              duration:
 *                type: number
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *            required:
 *              - title
 *              - description
 *              - duration
 *    responses:
 *      '201':
 *        description: Successfully created a movie
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
  asyncHandler(movieController.create.bind(movieController))
)

/**
 * @swagger
 * /movies/{id}:
 *  get:
 *    summary: Get a single movie
 *    description: This endpoint returns a single movie by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the movie to retrieve
 *    responses:
 *      '200':
 *        description: Successfully retrieved the movie
 *      '404':
 *        description: Movie not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(movieController.getSingle.bind(movieController))
)

/**
 * @swagger
 * /movies/{id}:
 *  put:
 *    summary: Update a movie
 *    description: This endpoint updates a movie by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the movie to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              duration:
 *                type: number
 *            required:
 *              - title
 *              - description
 *              - duration
 *    responses:
 *      '200':
 *        description: Successfully updated the movie
 *      '400':
 *        description: Invalid request body
 *      '404':
 *        description: Movie not found
 *      '500':
 *        description: Internal server error
 */
router.put(
  '/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(movieController.update.bind(movieController))
)

/**
 * @swagger
 * /movies/{id}/add-image:
 *  patch:
 *    summary: Add an image to a movie
 *    description: This endpoint adds an image to a movie by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the movie to add an image to
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
 *    responses:
 *      '200':
 *        description: Successfully added an image to the movie
 *      '400':
 *        description: Invalid request body
 *      '404':
 *        description: Movie not found
 *      '500':
 *        description: Internal server error
 */
router.patch(
  '/:id/add-image',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  uploadSingle,
  asyncHandler(movieController.addImage.bind(movieController))
)

/**
 * @swagger
 * /movies/remove-image/{imageId}:
 *  delete:
 *    summary: Remove an image from a movie
 *    description: This endpoint removes an image from a movie by the image's ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    parameters:
 *      - in: path
 *        name: imageId
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the image to remove
 *    responses:
 *      '200':
 *        description: Successfully removed the image from the movie
 *      '404':
 *        description: Image not found
 *      '500':
 *        description: Internal server error
 */
router.delete(
  '/remove-image/:imageId',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(movieController.removeImage.bind(movieController))
)

/**
 * @swagger
 * /movies/{id}:
 *  delete:
 *    summary: Delete a movie
 *    description: This endpoint deletes a movie by its ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the movie to delete
 *    responses:
 *      '200':
 *        description: Successfully deleted the movie
 *      '404':
 *        description: Movie not found
 *      '500':
 *        description: Internal server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(movieController.delete.bind(movieController))
)

/**
 * @swagger
 * /movies/{id}/sessions:
 *  get:
 *    summary: Get sessions for a movie
 *    description: This endpoint returns sessions for a movie
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Movie
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the movie to get sessions for
 *    responses:
 *      '200':
 *        description: Successfully retrieved sessions for a movie
 *      '404':
 *        description: Movie not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/:id/sessions',
  authenticate,
  asyncHandler(movieController.getSessions.bind(movieController))
)

export default router

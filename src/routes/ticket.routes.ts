import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { TicketController } from '../controllers/ticket.controller'

const router = express.Router()

const ticketController = container.get(TicketController)

/**
 * @swagger
 * /tickets:
 *  get:
 *    summary: Get user's tickets
 *    description: This endpoint returns all tickets of the authenticated user
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Ticket
 *    responses:
 *      '200':
 *        description: Successfully retrieved tickets
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/',
  authenticate,
  asyncHandler(ticketController.getUserTickets.bind(ticketController))
)

/**
 * @swagger
 * /tickets/buy:
 *  post:
 *    summary: Buy a ticket
 *    description: This endpoint buys a ticket
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Ticket
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ticketType:
 *                type: string
 *            required:
 *              - ticketType
 *    responses:
 *      '201':
 *        description: Successfully bought a ticket
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/buy',
  authenticate,
  asyncHandler(ticketController.buyTicket.bind(ticketController))
)

export default router

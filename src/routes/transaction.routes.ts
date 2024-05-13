import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { authenticate } from '../middlewares/authenticate.middleware'
import { TransactionController } from '../controllers/transaction.controller'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'

const router = express.Router()

const transactionController = container.get(TransactionController)

/**
 * @swagger
 * /transactions:
 *  get:
 *    summary: Get all transactions
 *    description: This endpoint returns all transactions
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Transaction
 *    responses:
 *      '200':
 *        description: Successfully retrieved transactions
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/',
  authenticate,
  asyncHandler(
    transactionController.getTransactions.bind(transactionController)
  )
)

/**
 * @swagger
 * /transactions/deposit:
 *  post:
 *    summary: Make a deposit
 *    description: This endpoint makes a deposit
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Transaction
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *              card:
 *                type: string
 *            required:
 *              - amount
 *              - card
 *    responses:
 *      '201':
 *        description: Successfully made a deposit
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/deposit',
  authenticate,
  asyncHandler(transactionController.deposit.bind(transactionController))
)

/**
 * @swagger
 * /transactions/withdraw:
 *  post:
 *    summary: Make a withdrawal
 *    description: This endpoint makes a withdrawal
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Transaction
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *              bankAccount:
 *                type: string
 *            required:
 *              - amount
 *              - bankAccount
 *    responses:
 *      '201':
 *        description: Successfully made a withdrawal
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/withdraw',
  authenticate,
  asyncHandler(transactionController.withdraw.bind(transactionController))
)

/**
 * @swagger
 * /transactions/buy-ticket:
 *  post:
 *    summary: Buy a ticket
 *    description: This endpoint buys a ticket
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Transaction
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
  '/buy-ticket',
  authenticate,
  asyncHandler(transactionController.buyTicket.bind(transactionController))
)

/**
 * @swagger
 * /transactions/users/{id}:
 *  get:
 *    summary: Get a user's transactions
 *    description: This endpoint returns a user's transactions by user ID
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Transaction
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the user to retrieve transactions for
 *    responses:
 *      '200':
 *        description: Successfully retrieved the user's transactions
 *      '404':
 *        description: User not found
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/users/:id',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(
    transactionController.getUserTransactions.bind(transactionController)
  )
)

export default router

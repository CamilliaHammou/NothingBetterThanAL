import express from 'express'
import asyncHandler from 'express-async-handler'
import { container } from '../config/inversify.config'
import { UserController } from '../controllers/user.controller'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { userTypes } from '../constants/userTypes'

const router = express.Router()

const userController = container.get(UserController)

// Admin only route
/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    description: This endpoint returns all users
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        required: false
 *        description: The page number to retrieve
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: The number of users to retrieve per page
 *    responses:
 *      '200':
 *        description: Successfully retrieved users
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(userController.getUsers.bind(userController))
)

/**
 * @swagger
 * /users/employees:
 *  get:
 *    summary: Get all employees
 *    description: This endpoint returns all employees
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        required: false
 *        description: The page number to retrieve
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: The number of employees to retrieve per page
 *    responses:
 *      '200':
 *        description: Successfully retrieved employees
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/employees',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(userController.getEmployees.bind(userController))
)

/**
 * @swagger
 * /users/signup:
 *  post:
 *    summary: Signup a new user
 *    description: This endpoint allows a new user to signup
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - name
 *              - email
 *              - password
 *    responses:
 *      '201':
 *        description: Successfully signed up
 *      '400':
 *        description: Invalid request body
 *      '500':
 *        description: Internal server error
 */
router.post('/signup', asyncHandler(userController.signup.bind(userController)))

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: Login a user
 *    description: This endpoint allows a user to login
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email
 *              - password
 *    responses:
 *      '200':
 *        description: Successfully logged in
 *      '400':
 *        description: Invalid request body
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */
router.post('/login', asyncHandler(userController.login.bind(userController)))

/**
 * @swagger
 * /users/logout:
 *  post:
 *    summary: Logout a user
 *    description: This endpoint allows a user to logout
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    responses:
 *      '200':
 *        description: Successfully logged out
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(userController.logout.bind(userController))
)

/**
 * @swagger
 * /users/refresh-token:
 *  post:
 *    summary: Refresh user token
 *    description: This endpoint allows a user to refresh their token
 *    tags:
 *      - User
 *    responses:
 *      '200':
 *        description: Successfully refreshed token
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/refresh-token',
  asyncHandler(userController.refreshToken.bind(userController))
)

/**
 * @swagger
 * /users/profile:
 *  get:
 *    summary: Get user profile
 *    description: This endpoint returns the profile of the authenticated user
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    responses:
 *      '200':
 *        description: Successfully retrieved user profile
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */
router.get(
  '/profile',
  authenticate,
  asyncHandler(userController.getProfile.bind(userController))
)

// Admin only route
/**
 * @swagger
 * /users/add-employee:
 *  post:
 *    summary: Add an existing user as an employee
 *    description: This endpoint allows an admin to add an existing user as an employee
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              role:
 *                type: string
 *            required:
 *              - id
 *              - role
 *    responses:
 *      '200':
 *        description: Successfully added employee
 *      '400':
 *        description: Invalid request body
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/add-employee',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(userController.addEmployee.bind(userController))
)

// Admin only route
/**
 * @swagger
 * /users/create-employee:
 *  post:
 *    summary: Create a new employee
 *    description: This endpoint allows an admin to create a new employee
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              role:
 *                type: string
 *            required:
 *              - name
 *              - email
 *              - password
 *              - role
 *    responses:
 *      '201':
 *        description: Successfully created employee
 *      '400':
 *        description: Invalid request body
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */
router.post(
  '/create-employee',
  authenticate,
  authorize([userTypes.SUPER_ADMIN, userTypes.ADMIN]),
  asyncHandler(userController.createEmployee.bind(userController))
)

export default router

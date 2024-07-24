import express from 'express';
import { createUser, loginUser } from '../controllers/user.controller';

const userRoutes = express.Router();

/**
 * @route POST /users/create
 * @desc Create a new user
 * @access Public
 */
userRoutes.route('/create').post(createUser);

/**
 * @route POST /users/login
 * @desc Login a user
 * @access Public
 */
userRoutes.route('/login').post(loginUser);

export default userRoutes;

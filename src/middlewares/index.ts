import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user-model';

export interface AuthRequest extends Request {
  user?: string;
}

const secretKey = process.env.JWT_SECRET || 'default-secret';

export const authenticationMiddleware = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({
        error: 'Authorization token is required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, secretKey) as { _id: string };

    const existingUser = await User.findById(decoded._id);
    if (!existingUser) {
      return response.status(401).json({
        error: 'User not found',
      });
    }

    request.user = existingUser.id;
    next();
  } catch (error) {
    console.error('Error in authenticationMiddleware:', error);
    return response.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};
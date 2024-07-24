import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../models/user-model';
import { IUser } from '../types';

const secretKey = process.env.JWT_SECRET || 'default-secret';

const getUserToken = (_id: string | Types.ObjectId) => {
  return jwt.sign({ _id }, secretKey, { expiresIn: '1d' });
};

export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password } = request.body;
    if (!email || !name || !password) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = getUserToken(user._id);
    response.status(201).json({
      token: `Bearer ${token}`,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    response.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password }: IUser = request.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return response.status(404).json({ error: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (isPasswordCorrect) {
      const token = getUserToken(existingUser._id);
      return response.json({
        token: `Bearer ${token}`,
        user: {
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    } else {
      return response.status(400).json({ error: 'Wrong credentials' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    response.status(500).json({ error: 'An error occurred during login' });
  }
};

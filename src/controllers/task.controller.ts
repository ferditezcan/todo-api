import { Response } from "express"
import { AuthRequest } from "../middlewares"
import Task from "../models/task-model"
import { ITask } from "../types"

export const getAllTasks = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const tasks = await Task.find({ user: userId });
    response.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    response.status(400).json({ error: 'Error while fetching tasks' });
  }
};

export const getAllCompletedTasks = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const tasks = await Task.find({
      user: userId,
      isCompleted: true,
    });

    response.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getAllCompletedTasks:', error);
    response.status(400).json({ error: 'Error while fetching completed tasks' });
  }
};

export const getTasksForToday = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: userId,
      date: {
        $gte: startOfToday,
        $lt: endOfToday
      }
    });

    response.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getTasksForToday:', error);
    response.status(400).json({ error: 'Error while fetching tasks for today' });
  }
};

export const createTask = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;
    const { name, date, categoryId }: ITask = request.body;

    if (!name || !date) {
      return response.status(400).json({ error: 'Name and date are required' });
    }

    const task = new Task({
      name,
      date,
      categoryId,
      user: userId,
    });

    await task.save();

    response.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    response.status(400).json({ error: 'Error while creating task' });
  }
};

export const toggleTaskStatus = async (request: AuthRequest, response: Response) => {
  try {
    const { isCompleted } = request.body;
    const { id } = request.params;

    if (typeof isCompleted !== 'boolean') {
      return response.status(400).json({ error: 'Invalid value for isCompleted' });
    }

    const result = await Task.updateOne(
      { _id: id, user: request.user },
      { isCompleted }
    );

    if (result.modifiedCount === 0) {
      return response.status(404).json({ error: 'Task not found or not authorized' });
    }

    response.status(200).json({ message: 'Task status updated' });
  } catch (error) {
    console.error('Error in toggleTaskStatus:', error);
    response.status(500).json({ error: 'Error while toggling task status' });
  }
};

export const deleteTask = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;

    const result = await Task.deleteOne({ _id: id, user: request.user });

    if (result.deletedCount === 0) {
      return response.status(404).json({ error: 'Task not found or not authorized' });
    }

    response.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    response.status(500).json({ error: 'Error while deleting task' });
  }
};

export const editTask = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    const { date, name, categoryId }: ITask = request.body;

    if (!name || !date) {
      return response.status(400).json({ error: 'Name and date are required' });
    }

    const result = await Task.updateOne(
      { _id: id, user: request.user },
      {
        $set: { name, categoryId, date },
      }
    );

    if (result.modifiedCount === 0) {
      return response.status(404).json({ error: 'Task not found or not authorized' });
    }

    response.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error in editTask:', error);
    response.status(500).json({ error: 'Error while updating the task' });
  }
};

export const getAllTasksByCategory = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = request.params
    const tasks = await Task.find({
      user: userId,
      categoryId: id,
    })
    response.status(200).json(tasks);
  } catch (error) {
    console.log("error in getAllTasksByCategory", error)
    response.status(400).json({ error: 'Error while fetching tasks' });
  }
}

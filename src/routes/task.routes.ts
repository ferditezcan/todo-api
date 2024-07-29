import express from 'express';
import {
  createTask,
  deleteTask,
  editTask,
  getAllCompletedTasks,
  getAllTasks,
  getAllTasksByCategory,
  getTasksForToday,
  toggleTaskStatus,
} from '../controllers/task.controller';
import { authenticationMiddleware } from '../middlewares';

const taskRoutes = express.Router();

taskRoutes.use(authenticationMiddleware);

/**
 * @route GET /tasks
 * @desc Get all tasks
 * @access Private
 */
taskRoutes.route('/').get(getAllTasks);

/**
 * @route GET /tasks/tasks-by-categories/:id
 * @desc Get tasks by categories
 * @access Private
 */
taskRoutes.route("/tasks-by-categories/:id").get(getAllTasksByCategory)

/**
 * @route GET /tasks/completed
 * @desc Get all completed tasks
 * @access Private
 */
taskRoutes.route('/completed').get(getAllCompletedTasks);

/**
 * @route GET /tasks/today
 * @desc Get tasks for today
 * @access Private
 */
taskRoutes.route('/today').get(getTasksForToday);

/**
 * @route POST /tasks/create
 * @desc Create a new task
 * @access Private
 */
taskRoutes.route('/create').post(createTask);

/**
 * @route PUT /tasks/update/:id
 * @desc Toggle the status of a task
 * @access Private
 */
taskRoutes.route('/update/:id').put(toggleTaskStatus);

/**
 * @route DELETE /tasks/:id
 * @desc Delete a task
 * @access Private
 */
taskRoutes.route('/:id').delete(deleteTask);

/**
 * @route PUT /tasks/edit/:id
 * @desc Edit a task
 * @access Private
 */
taskRoutes.route('/edit/:id').put(editTask);

export default taskRoutes;
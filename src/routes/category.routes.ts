import express from "express"
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller"
import { authenticationMiddleware } from "../middlewares"

const categoryRoutes = express.Router()

categoryRoutes.use(authenticationMiddleware)

/**
 * @route GET /categories
 * @desc Get all categories
 * @access Private
 */
categoryRoutes.route("/").get(getAllCategories)

/**
 * @route GET /categories/:id
 * @desc Get category by id
 * @access Private
 */
categoryRoutes.route("/:id").get(getCategoryById)

/**
 * @route POST /categories/create
 * @desc Create a new categories
 * @access Private
 */
categoryRoutes.route("/create").post(createCategory)

/**
 * @route DELETE /categories/:id
 * @desc Delete a category
 * @access Private
 */
categoryRoutes.route("/:id").delete(deleteCategory)

/**
 * @route PUT /categories/update
 * @desc Update a category
 * @access Private
 */
categoryRoutes.route("/update").put(updateCategory)

export default categoryRoutes

import { Response } from "express"
import { AuthRequest } from "../middlewares"
import Category from "../models/category-model"
import Task from "../models/task-model"
import { ICategory } from "../types"

export const getAllCategories = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        const categories = await Category.find({ user });
        response.status(200).json(categories);
    } catch (error) {
        console.log("error in getAllCategories", error)
        response.status(400).json({ error: 'Error while fetching categories' });
    }
}

export const getCategoryById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request;
        const { id } = request.params;

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        const category = await Category.findOne({ _id: id, user });
        if (!category) {
            return response.status(404).json({ error: 'Category not found' });
        }

        response.status(200).json(category);
    } catch (error) {
        console.error("Error in getCategoryById:", error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createCategory = async (request: AuthRequest, response: Response) => {
    try {
        const { color, icon, name }: ICategory = request.body
        const { user } = request

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        if (!name || !color || !icon) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        const category = await Category.create({
            color,
            icon,
            name,
            user,
        })
        response.status(200).json(category);
    } catch (error) {
        console.log("error in createCategory", error);
        response.status(400).json({ error: "Something went wrong" });
    }
}

export const deleteCategory = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request;
        const { id } = request.params;

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        await Task.deleteMany({ categoryId: id });
        const result = await Category.deleteOne({ _id: id, user });

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Category not found' });
        }

        response.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        response.status(400).json({ error: "Error in deleting the category" });
    }
}

export const updateCategory = async (request: AuthRequest, response: Response) => {
    try {
        const { _id, color, icon, isEditable, name }: ICategory = request.body;
        const { user } = request;

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id, user },
            { color, icon, isEditable, name },
            { new: true }
        );

        if (!updatedCategory) {
            return response.status(404).json({ error: 'Category not found' });
        }

        response.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.log("error in updateCategory", error)
        response.send({ error: "Error in updating the category" })
    }
}

import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  saveToCache,
  invalidateCategoryCache,
  CACHE_KEYS,
} from "../middleware/cache";

// Create a new category
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, taxApplicable, tax, taxType } = req.body;
    const image = req.file ? (req.file as any).location : null;

    const category = await prisma.category.create({
      data: { name, image, description, taxApplicable, tax, taxType },
    });
    await invalidateCategoryCache();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error creating category" });
  }
};

// Get all categories
export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    await saveToCache(CACHE_KEYS.CATEGORIES, categories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// Get a category by ID
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    await saveToCache(CACHE_KEYS.CATEGORY(id), category);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error fetching category" });
  }
};

// Get a category by name
export const getCategoryByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.params;
    const category = await prisma.category.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    await saveToCache(CACHE_KEYS.CATEGORY(String(category.id)), category);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error fetching category" });
  }
};

// Update a category
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.image = (req.file as any).location;
    }
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data,
    });
    await invalidateCategoryCache(id);
    res.json(updatedCategory);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(500).json({ error: "Error updating category" });
  }
};

// Delete a category
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: parseInt(id) } });
    await invalidateCategoryCache(id);
    res.status(204).send();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(500).json({ error: "Error deleting category" });
  }
};

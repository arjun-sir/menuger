import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  saveToCache,
  invalidateSubcategoryCache,
  CACHE_KEYS,
} from "../middleware/cache";

// Create a subcategory
export const createSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, taxApplicable, tax, categoryId } = req.body;
    const image = req.file ? (req.file as any).location : null;

    const subCategory = await prisma.subCategory.create({
      data: { name, image, description, taxApplicable, tax, categoryId },
    });
    await invalidateSubcategoryCache(String(categoryId));
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating subcategory" });
  }
};

// Get all subcategories
export const getSubCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const subCategories = await prisma.subCategory.findMany();
    await saveToCache(CACHE_KEYS.SUBCATEGORIES, subCategories);
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategories" });
  }
};

// Get subcategories by category
export const getSubCategoriesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const subCategories = await prisma.subCategory.findMany({
      where: { categoryId: parseInt(categoryId) },
    });
    await saveToCache(
      CACHE_KEYS.SUBCATEGORY_BY_CATEGORY(categoryId),
      subCategories
    );
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategories" });
  }
};

// Get subcategory by ID
export const getSubCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: parseInt(id) },
    });
    if (!subCategory) {
      res.status(404).json({ error: "Subcategory not found" });
      return;
    }
    await saveToCache(CACHE_KEYS.SUBCATEGORY(id), subCategory);
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategory" });
  }
};

// Get subcategory by name
export const getSubCategoryByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.params;
    const subCategory = await prisma.subCategory.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (!subCategory) {
      res.status(404).json({ error: "Subcategory not found" });
      return;
    }
    await saveToCache(CACHE_KEYS.SUBCATEGORY_BY_NAME(name), subCategory);
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategory" });
  }
};

// Update subcategory
export const updateSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.image = (req.file as any).location;
    }
    const updatedSubCategory = await prisma.subCategory.update({
      where: { id: parseInt(id) },
      data,
    });
    await invalidateSubcategoryCache(String(updatedSubCategory.categoryId), id);
    res.json(updatedSubCategory);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Subcategory not found" });
      return;
    }
    res.status(500).json({ error: "Error updating subcategory" });
  }
};

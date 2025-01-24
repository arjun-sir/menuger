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
    const { name, image, description, taxApplicable, tax, categoryId } =
      req.body;
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

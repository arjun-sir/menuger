import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  saveToCache,
  invalidateItemsCache,
  CACHE_KEYS,
} from "../middleware/cache";

// Create an item
export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      taxApplicable,
      tax,
      baseAmount,
      discount,
      subCategoryId,
      categoryId,
    } = req.body;
    const image = req.file ? (req.file as any).location : null;
    const totalAmount = baseAmount - (discount || 0);

    const item = await prisma.item.create({
      data: {
        name,
        image,
        description,
        taxApplicable,
        tax,
        baseAmount,
        discount,
        totalAmount,
        subCategoryId,
        categoryId,
      },
    });
    await invalidateItemsCache(
      undefined,
      String(categoryId),
      String(subCategoryId)
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Error creating item" });
  }
};

// Get all items
export const getItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.item.findMany();
    await saveToCache(CACHE_KEYS.ITEMS, items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
};

// Get item by ID
export const getItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    await saveToCache(CACHE_KEYS.ITEM(id), item);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
};

// Get item by name
export const getItemByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.params;
    const item = await prisma.item.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    await saveToCache(CACHE_KEYS.ITEM_BY_NAME(name), item);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
};

// Get items by category
export const getItemsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const items = await prisma.item.findMany({
      where: { categoryId: parseInt(categoryId) },
    });
    await saveToCache(CACHE_KEYS.ITEMS_BY_CATEGORY(categoryId), items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
};

// Get items by subcategory
export const getItemsBySubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;
    const items = await prisma.item.findMany({
      where: { subCategoryId: parseInt(subcategoryId) },
    });
    await saveToCache(CACHE_KEYS.ITEMS_BY_SUBCATEGORY(subcategoryId), items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
};

// Search items by name
export const searchItemsByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;
    const items = await prisma.item.findMany({
      where: { name: { contains: String(name), mode: "insensitive" } },
    });
    await saveToCache(CACHE_KEYS.ITEMS_SEARCH(String(name)), items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error searching items" });
  }
};

// Update item
export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.image = (req.file as any).location;
    }
    if (data.baseAmount && data.discount !== undefined) {
      data.totalAmount = data.baseAmount - (data.discount || 0);
    }
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data,
    });
    await invalidateItemsCache(
      undefined,
      String(updatedItem.categoryId),
      String(updatedItem.subCategoryId)
    );
    res.json(updatedItem);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(500).json({ error: "Error updating item" });
  }
};

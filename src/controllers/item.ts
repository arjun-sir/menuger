import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create an item
export const createItem = async (req: Request, res: Response) => {
  try {
    const {
      name,
      image,
      description,
      taxApplicable,
      tax,
      baseAmount,
      discount,
      subCategoryId,
      categoryId,
    } = req.body;
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
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Error creating item" });
  }
};

// Search items by name
export const searchItemsByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const items = await prisma.item.findMany({
      where: { name: { contains: String(name), mode: "insensitive" } },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error searching items" });
  }
};

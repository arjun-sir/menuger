import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient";

export const CACHE_KEYS = {
  CATEGORIES: "categories",
  CATEGORY: (id: string) => `category:${id}`,
  SUBCATEGORIES: "subcategories",
  SUBCATEGORY_BY_CATEGORY: (categoryId: string) =>
    `subcategories:category:${categoryId}`,
  ITEMS: "items",
  ITEMS_SEARCH: (query: string) => `items:search:${query}`,
};

export const cacheMiddleware = (keyGenerator: (req: Request) => string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const cacheKey = keyGenerator(req);

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    res.locals.cacheKey = cacheKey;
    next();
  };
};

export const saveToCache = async (key: string, data: any, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(data), { EX: ttl });
};

export const invalidateCache = async (...keys: string[]) => {
  await redisClient.del(keys);
};

export const invalidateCategoryCache = async (categoryId?: string) => {
  const keys = [CACHE_KEYS.CATEGORIES];
  if (categoryId) {
    keys.push(CACHE_KEYS.CATEGORY(categoryId));
    // Also invalidate related subcategories cache
    keys.push(CACHE_KEYS.SUBCATEGORY_BY_CATEGORY(categoryId));
  }
  await invalidateCache(...keys);
};

export const invalidateSubcategoryCache = async (categoryId?: string) => {
  const keys = [CACHE_KEYS.SUBCATEGORIES];
  if (categoryId) {
    keys.push(CACHE_KEYS.SUBCATEGORY_BY_CATEGORY(categoryId));
  }
  await invalidateCache(...keys);
};

export const invalidateItemsCache = async (searchQuery?: string) => {
  const keys = [CACHE_KEYS.ITEMS];
  if (searchQuery) {
    keys.push(CACHE_KEYS.ITEMS_SEARCH(searchQuery));
  }
  await invalidateCache(...keys);
};

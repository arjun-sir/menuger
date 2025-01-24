import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient";

export const CACHE_KEYS = {
  CATEGORIES: "categories",
  CATEGORY: (id: string) => `category:${id}`,
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
  }
  await invalidateCache(...keys);
};

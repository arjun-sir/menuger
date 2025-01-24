import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
} from "../controllers/subcategory";
import { cacheMiddleware, CACHE_KEYS } from "../middleware/cache";

const router = express.Router();

router.post("/", createSubCategory);
router.get(
  "/",
  cacheMiddleware(() => CACHE_KEYS.SUBCATEGORIES),
  getSubCategories
);
router.get(
  "/category/:categoryId",
  cacheMiddleware((req) =>
    CACHE_KEYS.SUBCATEGORY_BY_CATEGORY(req.params.categoryId)
  ),
  getSubCategoriesByCategory
);

export default router;

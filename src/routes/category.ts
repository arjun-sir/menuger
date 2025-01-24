import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import { cacheMiddleware, CACHE_KEYS } from "../middleware/cache";

const router = express.Router();

router.post("/", createCategory);
router.get(
  "/",
  cacheMiddleware(() => CACHE_KEYS.CATEGORIES),
  getCategories
);
router.get(
  "/:id",
  cacheMiddleware((req) => CACHE_KEYS.CATEGORY(req.params.id)),
  getCategoryById
);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;

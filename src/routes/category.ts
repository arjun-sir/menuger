import express, { Request } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import { cacheMiddleware, CACHE_KEYS } from "../middleware/cache";

const router = express.Router();

interface ParamsDictionary {
  [key: string]: string;
}

// Create and List routes
router.post("/", createCategory);
router.get(
  "/",
  cacheMiddleware(() => CACHE_KEYS.CATEGORIES),
  getCategories
);

// Get by ID or name route
router.get("/:param", (req: Request<ParamsDictionary>, res, next) => {
  const param = req.params.param;
  const params = req.params as any;
  if (!isNaN(Number(param))) {
    params.id = param;
    cacheMiddleware((req) => CACHE_KEYS.CATEGORY(req.params.id))(req, res, () =>
      getCategoryById(req, res)
    );
  } else {
    params.name = param;
    cacheMiddleware((req) => CACHE_KEYS.CATEGORY_BY_NAME(req.params.name))(
      req,
      res,
      () => getCategoryByName(req, res)
    );
  }
});

// Update and Delete routes
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;

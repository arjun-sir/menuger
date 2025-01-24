import express, { Request } from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  getSubCategoryByName,
  updateSubCategory,
} from "../controllers/subcategory";
import { cacheMiddleware, CACHE_KEYS } from "../middleware/cache";

const router = express.Router();

interface ParamsDictionary {
  [key: string]: string;
}

// Create and List routes
router.post("/", createSubCategory);
router.get(
  "/",
  cacheMiddleware(() => CACHE_KEYS.SUBCATEGORIES),
  getSubCategories
);

// Get by ID or name route
router.get("/:param", (req: Request<ParamsDictionary>, res, next) => {
  const param = req.params.param;
  const params = req.params as any;
  if (!isNaN(Number(param))) {
    params.id = param;
    cacheMiddleware((req) => CACHE_KEYS.SUBCATEGORY(req.params.id))(
      req,
      res,
      () => getSubCategoryById(req, res)
    );
  } else {
    params.name = param;
    cacheMiddleware((req) => CACHE_KEYS.SUBCATEGORY_BY_NAME(req.params.name))(
      req,
      res,
      () => getSubCategoryByName(req, res)
    );
  }
});

// Get by category
router.get(
  "/category/:categoryId",
  cacheMiddleware((req) =>
    CACHE_KEYS.SUBCATEGORY_BY_CATEGORY(req.params.categoryId)
  ),
  getSubCategoriesByCategory
);

// Update route
router.put("/:id", updateSubCategory);

export default router;

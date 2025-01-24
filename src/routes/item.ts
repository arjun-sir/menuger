import express, { Request } from "express";
import {
  createItem,
  getItems,
  getItemById,
  getItemByName,
  getItemsByCategory,
  getItemsBySubCategory,
  searchItemsByName,
  updateItem,
} from "../controllers/item";
import { cacheMiddleware, CACHE_KEYS } from "../middleware/cache";

const router = express.Router();

interface ParamsDictionary {
  [key: string]: string;
}

// Create and List routes
router.post("/", createItem);
router.get(
  "/",
  cacheMiddleware(() => CACHE_KEYS.ITEMS),
  getItems
);

// Get by ID or name route
router.get("/:param", (req: Request<ParamsDictionary>, res, next) => {
  const param = req.params.param;
  const params = req.params as any;
  if (!isNaN(Number(param))) {
    params.id = param;
    cacheMiddleware((req) => CACHE_KEYS.ITEM(req.params.id))(req, res, () =>
      getItemById(req, res)
    );
  } else {
    params.name = param;
    cacheMiddleware((req) => CACHE_KEYS.ITEM_BY_NAME(req.params.name))(
      req,
      res,
      () => getItemByName(req, res)
    );
  }
});

// Get by category or subcategory
router.get(
  "/category/:categoryId",
  cacheMiddleware((req) => CACHE_KEYS.ITEMS_BY_CATEGORY(req.params.categoryId)),
  getItemsByCategory
);
router.get(
  "/subcategory/:subcategoryId",
  cacheMiddleware((req) =>
    CACHE_KEYS.ITEMS_BY_SUBCATEGORY(req.params.subcategoryId)
  ),
  getItemsBySubCategory
);

// Search route
router.get(
  "/search",
  cacheMiddleware((req) => CACHE_KEYS.ITEMS_SEARCH(String(req.query.name))),
  searchItemsByName
);

// Update route
router.put("/:id", updateItem);

export default router;

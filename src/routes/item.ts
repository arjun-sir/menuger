import express from "express";
import { createItem, searchItemsByName } from "../controllers/item";
import { cacheMiddleware, CACHE_KEYS } from "../middleware/cache";

const router = express.Router();

router.post("/", createItem);
router.get(
  "/search",
  cacheMiddleware((req) => CACHE_KEYS.ITEMS_SEARCH(String(req.query.name))),
  searchItemsByName
);

export default router;

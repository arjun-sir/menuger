import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
} from "../controllers/subcategory";

const router = express.Router();

router.post("/", createSubCategory);
router.get("/", getSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);

export default router;

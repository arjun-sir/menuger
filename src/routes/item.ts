import express from "express";
import { createItem, searchItemsByName } from "../controllers/item";

const router = express.Router();

router.post("/", createItem);
router.get("/search", searchItemsByName);

export default router;

import express from "express";
import categoryRoutes from "./routes/category";
import subCategoryRoutes from "./routes/subcategory";
import itemRoutes from "./routes/item";
import { apiRateLimiter } from "./middleware/rateLimiter";

const app = express();
app.use(express.json());

app.use("/api", apiRateLimiter);

app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/item", itemRoutes);

export default app;

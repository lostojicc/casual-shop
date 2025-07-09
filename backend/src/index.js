import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.route.js";
import cors from "cors";

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser({
    origin: true,
    credentials: true
}));
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);

app.listen(ENV.PORT, () => console.log(`Server is running on PORT: ${ENV.PORT}`));
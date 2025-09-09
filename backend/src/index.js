import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import cartRoutes from "./routes/cart.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticRoutes from "./routes/analytic.route.js";
import cors from "cors";

const app = express();
connectDB();

app.use("/api/payment", paymentRoutes);
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/analytics", analyticRoutes);

app.listen(ENV.PORT, () => console.log(`Server is running on PORT: ${ENV.PORT}`));
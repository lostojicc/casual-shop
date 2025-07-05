import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(ENV.PORT, () => console.log(`Server is running on PORT: ${ENV.PORT}`));
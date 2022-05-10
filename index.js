import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import movimentRouter from "./routes/movimentRoutes.js";

dotenv.config();
let app = express();
app.use(json());
app.use(cors());
app.use(authRouter);
app.use(movimentRouter);
app.listen(process.env.PORTA);
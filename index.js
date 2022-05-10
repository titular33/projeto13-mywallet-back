import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { login, signUp } from "./controllers/authControllers.js";
import { getMoviment, postMoviment } from "./controllers/movimentControllers.js";

dotenv.config();
let app = express();
app.use(json());
app.use(cors());
app.post("/login", login);
app.post("/sign-up", signUp);
app.post("/moviment", postMoviment);
app.get("/moviment", getMoviment);
app.listen(process.env.PORTA);
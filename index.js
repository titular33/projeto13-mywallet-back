import express, { json } from "express";
import joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());
let db = null;

const mongoClient = new MongoClient(process.env.MONGO_URI);
const promise = mongoClient.connect();

promise.then(() => {
  db = mongoClient.db(process.env.BANCO);
  console.log("Conexão com o banco de dados MongoDB estabelecida!");
});
promise.catch((e) => console.log("Erro ao se conectar ao banco de dados" + e));
1;

app.get("/login", async (req, res) => {
  const { email, password } = req.body;
  const loginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required(),
  });

  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(422).send(error.details.map((detail) => detail.message));
  }

  try {
  } catch (error) {}
});

app.post("/sign-up", async (req, res) => {});

app.listen(process.env.PORTA);
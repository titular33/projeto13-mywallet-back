import express, { json } from "express";
import joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import dataBase from "dataBase.js";
import bcrypt from "bcrypt";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const loginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required(),
  });
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(422).send(error.details.map((detail) => detail.message));
  }
  try {
    const user = await dataBase.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid.v4();
      await dataBase.collection("sessions").insertOne({ userId: user._id, token });
      res.send(token);
    } else {
      res.status(401).send("Email/Senha incorretas!");
    }
  } catch (error) {
    res.send("A tentativa de logar apresentou o seguinte erro:", e);
  }
});

app.post("/sign-up", async (req, res) => {
  const { email, password, name, repeat_password } = req.body;
  const signUpSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required(),
    name: joi.string().required().alphanum(),
    repeat_password: joi.ref("password"),
  });
  const { error } = signUpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(422).send(error.details.map((detail) => detail.message));
  }
  try {
    const verificador = dataBase.collection("users").findOne({ email });
    if (verificador) {
      return res.status(409).send("Já existe um usuário com esse e-mail.");
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    await dataBase.collection("users").insertOne({ email, name, passwordHash });
    res.sendStatus(201);
  } catch (error) {
    res.send("A tentativa de logar apresentou o seguinte erro:", e);
  }
});

app.listen(process.env.PORTA);
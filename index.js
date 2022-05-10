import joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import { Db, MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
// import db from "./db.js";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();
promise.catch((e) => console.log("Erro na conexão ao banco de dados", e));
const db = mongoClient.db(process.env.BANCO);

const app = express();
app.use(json());
app.use(cors());

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
    const user = await db.collection("users").findOne({ email });
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      console.log("entrou");
      const token = uuid();
      await db.collection("sessions").insertOne({ userId: user._id, token });
      res.status(200).send(token);
    } else {
      res.status(401).send("Email/Senha incorretas!");
    }
  } catch (error) {
    console.log("Erro ao logar", error);
    res.sendStatus(500);
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
    const find = await db.collection("users").findOne({ email });
    console.log(find);
    if (find) {
      return res.status(409).send("Já existe um usuário com esse e-mail.");
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    await db
      .collection("users")
      .insertOne({ email, name, password: passwordHash });
    res.status(201).send();
  } catch (error) {
    console.log("Erro ao cadastrar", error);
    res.sendStatus(500);
  }
});
import db from "./../db.js";
import joi from "joi";

export async function postMoviment(req, res) {
  const { authorization } = req.headers;
  const { value, isEntrada, description } = req.body;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Token não enviado.");
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return res.status(401).send("Sessao não encontrada.");
    }
    const user = await db.collection("users").findOne({
      _id: session.userId,
    });
    if (user) {
      const movimentSchema = joi.object({
        value: joi.number().required(),
        isEntrada: joi.boolean().required(),
        description: joi.string().required(),
      });
      const { error } = movimentSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(422)
          .send(error.details.map((detail) => detail.message));
      }

      await db
        .collection("moviments")
        .insertOne({ userId: user._id, value, isEntrada, description });
      return res.status(201).send("Movimentacao criada");
    } else {
      res.status(401).send("Usuario não encontrado.");
    }
  } catch (error) {
    console.log("Erro ao movimentar", error);
    res.sendStatus(500);
  }
}

export async function getMoviment(req, res) {
  const { authorization } = req.headers;
  const { value, isEntrada, description } = req.body;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Token não enviado.");
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return res.status(401).send("Sessao não encontrada.");
    }
    const user = await db.collection("users").findOne({
      _id: session.userId,
    });
    if (user) {
      const { _id } = user;
      const listMoviments = await db
        .collection("moviments")
        .find({ userId: _id })
        .toArray();
      return res.status(201).send(listMoviments);
    } else {
      res.status(401).send("Usuario não encontrado.");
    }
  } catch (error) {
    console.log("Erro ao movimentar", error);
    res.sendStatus(500);
  }
}
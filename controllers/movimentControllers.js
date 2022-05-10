import db from "./../db.js";
import joi from "joi";

export async function postMoviment(req, res) {
  const { value, isEntrada, description } = req.body;
  const user = req.userMiddleware;
  const movimentSchema = joi.object({
    value: joi.number().required(),
    isEntrada: joi.boolean().required(),
    description: joi.string().required(),
  });
  const { error } = movimentSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(422).send(error.details.map((detail) => detail.message));
  }
  try {
    await db
      .collection("moviments")
      .insertOne({ userId: user._id, value, isEntrada, description });
    return res.status(201).send("Movimentacao criada");
  } catch (error) {
    console.log("Erro ao movimentar", error);
    res.sendStatus(500);
  }
}

export async function getMoviment(req, res) {
  const { value, isEntrada, description } = req.body;
  try {
    const { _id } = req.userMiddleware;
    const listMoviments = await db
      .collection("moviments")
      .find({ userId: _id })
      .toArray();
    return res.status(200).send(listMoviments);
  } catch (error) {
    console.log("Erro ao movimentar", error);
    res.sendStatus(500);
  } 
}
import db from "./../db.js";

export async function validaHeader(req, res, next) {
  const { authorization } = req.headers;
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
      req.userMiddleware = user;
      next();
    } else {
      return res.status(401).send("Usuario não encontrado.");
    }
  } catch (error) {
    console.log("Erro ao verificar headers", error);
    res.sendStatus(500);
  }
}
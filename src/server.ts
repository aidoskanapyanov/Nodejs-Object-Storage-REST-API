import express from "express";
import authenticateJWT from "./middlewares/jwtAuth";

const app = express();

app.get("/", authenticateJWT, (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

export default app;

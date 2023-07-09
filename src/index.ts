import express from "express";
import authenticateJWT from "./middlewares/jwtAuth";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", authenticateJWT, (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log(`⚡Example app listening at http://localhost:${port}`);
});

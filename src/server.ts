import cors from "cors";
import express from "express";
import morgan from "morgan";
import authenticateJWT from "./middlewares/jwtAuth";

const app = express();

app.use(cors()); // allow all origins
app.use(morgan("dev")); // log status codes
app.use(express.json()); // parse json bodies (content-type: application/json)

app.get("/", authenticateJWT, (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: `had an error: ${err.message}` });
});

export default app;

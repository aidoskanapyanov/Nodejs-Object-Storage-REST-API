import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { refreshAccessToken, signin, signup } from "./handlers/auth";
import authenticateJWT from "./middlewares/jwtAuth";
import { AuthSchema, validate } from "./middlewares/validation";

const app = express();

app.use(cors()); // allow all origins
app.use(morgan("dev")); // log status codes
app.use(express.json()); // parse json bodies (content-type: application/json)
app.use(cookieParser());

app.get("/", authenticateJWT, (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.post("/signup", validate(AuthSchema), signup);
app.post("/signin", validate(AuthSchema), signin);
app.post("/signin/new_token", refreshAccessToken);

app.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: `had an error: ${err.message}` });
});

export default app;

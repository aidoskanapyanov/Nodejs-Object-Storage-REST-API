import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import { logout, refreshAccessToken, signin, signup } from "./handlers/auth";
import { deleteFile, listFiles, uploadFile } from "./handlers/files";
import { getUserInfo } from "./handlers/userInfo";
import authenticateJWT from "./middlewares/jwtAuth";
import {
  AuthSchema,
  RefreshTokenSchema,
  validate,
} from "./middlewares/validation";

const upload = multer({ dest: "uploads/" });
const app = express();

/**
 * middlewares
 */
app.use(cors()); // allow all origins
app.use(morgan("dev")); // log status codes
app.use(express.json()); // parse json bodies (content-type: application/json)
app.use(cookieParser());

/**
 * root route for simple auth middleware testing
 */
app.get("/", authenticateJWT, (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

/**
 * authentication routes
 */
app.post("/signup", validate(AuthSchema), signup);
app.post("/signin", validate(AuthSchema), signin);
app.post("/signin/new_token", validate(RefreshTokenSchema), refreshAccessToken);
app.get("/logout", authenticateJWT, validate(RefreshTokenSchema), logout);

/**
 * user info route
 */
app.get("/info", authenticateJWT, getUserInfo);

/**
 * file routes
 */
app.post(
  "/file/upload",
  authenticateJWT,
  upload.single("uploadedFile"),
  uploadFile
);
app.get("/file/list", authenticateJWT, listFiles);
app.delete("/file/delete/:id", authenticateJWT, deleteFile);

app.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: `had an error: ${err.message}` });
});

export default app;

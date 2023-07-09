import jwt from "jsonwebtoken";
import prisma from "../db";

export default function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const isTokenInvalidated = await prisma.invalidatedToken.findUnique({
        where: { accessToken },
      });

      if (isTokenInvalidated != null) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Store the decoded token or user information in the request object for later use
      req.user = decoded;
      next();
    }
  );
}

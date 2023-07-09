import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { createJwtTokens } from "../utils/jwt";

export const signin = async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: id.includes("@") ? { email: id } : { phoneNumber: id },
    });
    if (!user) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }
    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    const { accessToken, refreshToken } = createJwtTokens(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ accessToken });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  // if no refresh token, send 401 unauthorized
  if (!refreshToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // if user doesn't exist, send 401 unauthorized
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { accessToken } = createJwtTokens(user);

    res.json({ accessToken });
  } catch (e) {
    // if refresh token is expired, send 401 unauthorized
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Refresh token expired. Sign in again" });
      return;
    }
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const signup = async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email: id.includes("@") ? id : null,
        phoneNumber: id.includes("@") ? null : id,
        passwordHash: bcrypt.hashSync(password, 10),
      },
    });

    const { accessToken, refreshToken } = createJwtTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({ accessToken });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(400).json({ error: "Username already exists" });
      }
    }
  }
};

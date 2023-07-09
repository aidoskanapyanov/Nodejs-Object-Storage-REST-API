import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../db";
import { createJwtTokens } from "../utils/jwt";

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
    res.status(201).json({ accessToken, refreshToken });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(400).json({ error: "Username already exists" });
      }
    }
  }
};

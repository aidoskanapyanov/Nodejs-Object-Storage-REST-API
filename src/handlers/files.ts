import { File, Prisma } from "@prisma/client";
import path from "path";
import { createPaginator } from "prisma-pagination";
import prisma from "../db";

export const uploadFile = async (req, res) => {
  try {
    const savedFile = await prisma.file.create({
      data: {
        originalname: req.file.originalname,
        extension: path.extname(req.file.originalname),
        mimeType: req.file.mimetype,
        size: req.file.size,
        encoding: req.file.encoding,
        filename: req.file.filename,
        path: req.file.path,
        userId: req.user.userId,
      },
    });
    res.json({ message: "file upload successful", savedFile });
  } catch (e) {
    res.status(500).json({ message: "file upload failed" });
  }
};

export const listFiles = async (req, res) => {
  const query = req.query;
  const paginate = createPaginator({ perPage: query.list_size || 10 });

  const files = await paginate<File, Prisma.FileFindManyArgs>(
    prisma.file,
    {
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        id: "desc",
      },
    },
    { page: query.page || 1 }
  );
  res.json({ files });
};

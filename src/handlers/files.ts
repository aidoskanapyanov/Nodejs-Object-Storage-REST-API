import { File, Prisma } from "@prisma/client";
import fs from "fs";
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
    console.log(e);

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

export const deleteFile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedFile = await prisma.file.delete({
      where: {
        id_userId: {
          id,
          userId: req.user.userId,
        },
      },
    });
    fs.unlinkSync(deletedFile.path);

    res.status(204).json({ message: "file deleted successfully" });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        res
          .status(404)
          .json({ message: "you're trying to delete a nonexistent file" });
        return;
      }
    }
    console.log(e);
    res.status(500).json({ message: "file deletion failed" });
  }
};

export const getFileInfo = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.file.findUnique({
      where: {
        id_userId: {
          id,
          userId: req.user.userId,
        },
      },
    });

    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    res.json({ file });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "file info retrieval failed" });
  }
};

export const downloadFile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.file.findUnique({
      where: {
        id_userId: {
          id,
          userId: req.user.userId,
        },
      },
    });

    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    res.download(file.path, file.originalname);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "file download failed" });
  }
};

export const updateFile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const fileToUpdate = await prisma.file.findUnique({
      where: {
        id_userId: {
          id,
          userId: req.user.userId,
        },
      },
    });
    if (!fileToUpdate) {
      return res
        .status(404)
        .json({ message: "you're trying to update a nonexistent file" });
    }
    fs.unlinkSync(fileToUpdate.path);

    const updatedFile = await prisma.file.update({
      where: {
        id_userId: {
          id,
          userId: req.user.userId,
        },
      },
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
    res.json({ updatedFile });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "file update failed" });
  }
};

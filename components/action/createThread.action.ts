"use server";
import { prisma } from "@/lib/prisma";

export const createThread = async (
  authorId: string,
  image: string,
  content: null | string
) => {
  if (!content) {
    prisma.$disconnect();
    throw new Error("Content is required");
  }
  if (!image) {
    const thread = await prisma.thread.create({
      data: {
        authorId,
        content,
      },
    });
    prisma.$disconnect();
    return thread;
  }
  const thread = await prisma.thread.create({
    data: {
      authorId,
      content,
      image: image,
    },
  });
  prisma.$disconnect();
  return thread;
};

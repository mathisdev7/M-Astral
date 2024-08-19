"use server";
import { prisma } from "@/lib/prisma";

export const createThread = async (
  authorId: string,
  image: string,
  content: null | string
) => {
  console.log(authorId, image, content);
  if (!content) {
    throw new Error("Content is required");
  }
  if (!image) {
    const thread = await prisma.thread.create({
      data: {
        authorId,
        content,
      },
    });
    return thread;
  }
  const thread = await prisma.thread.create({
    data: {
      authorId,
      content,
      image: image,
    },
  });
  return thread;
};

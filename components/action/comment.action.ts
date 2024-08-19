"use server";
import { prisma } from "@/lib/prisma";

export const comment = async (
  userId: string,
  threadId: string,
  content: string
) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    throw new Error("User not found.");
  }
  const threadExists = await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
  });
  if (!threadExists) {
    throw new Error("Thread not found.");
  }
  try {
    await prisma.comment.create({
      data: {
        authorId: userId,
        threadId,
        content,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create comment.");
  }
  return true;
};

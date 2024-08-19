"use server";
import { prisma } from "@/lib/prisma";

export const follow = async (authorId: string, userId: string) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    throw new Error("User not found.");
  }
  const authorExists = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
  if (!authorExists) {
    throw new Error("Author not found.");
  }
  if (authorId === userId) {
    throw new Error("You cannot follow yourself.");
  }
  try {
    const followExists = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: authorId,
      },
    });
    if (followExists) {
      await prisma.follow.delete({
        where: {
          id: followExists.id,
        },
      });
      return false;
    }
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: authorId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to follow user.");
  }
  return true;
};

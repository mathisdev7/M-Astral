"use server";
import { prisma } from "@/lib/prisma";

export const commentLike = async (userId: string, commentId: string) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    throw new Error("User not found.");
  }
  const commentExists = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!commentExists) {
    throw new Error("Comment not found.");
  }
  try {
    const likeExists = await prisma.commentLike.findFirst({
      where: {
        userId,
        commentId,
      },
    });
    if (likeExists) {
      await prisma.commentLike.delete({
        where: {
          id: likeExists.id,
        },
      });
    } else {
      await prisma.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to like comment.");
  }
  return true;
};

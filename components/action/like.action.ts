"use server";
import { prisma } from "@/lib/prisma";

export const like = async (userId: string, threadId: string) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    prisma.$disconnect();
    throw new Error("User not found.");
  }
  const threadExists = await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      author: true,
      likes: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });
  if (!threadExists) {
    prisma.$disconnect();
    throw new Error("Thread not found.");
  }

  const likeExists = await prisma.like.findFirst({
    where: {
      userId,
      threadId,
    },
  });

  if (likeExists) {
    await prisma.like.delete({
      where: {
        id: likeExists.id,
      },
    });
    prisma.$disconnect();
    return false;
  } else {
    const isUserInterested = await prisma.userInterest.findFirst({
      where: {
        userId,
        category: threadExists.category[0],
      },
    });
    if (!isUserInterested) {
      await prisma.userInterest.create({
        data: {
          userId,
          category: threadExists.category[0],
          like: 1,
          thread: 0,
          comment: 0,
        },
      });
    } else {
      await prisma.userInterest.update({
        where: {
          id: isUserInterested.id,
        },
        data: {
          like: {
            increment: 1,
          },
        },
      });
    }
    await prisma.like.create({
      data: {
        userId,
        threadId,
      },
    });
  }

  prisma.$disconnect();
  return true;
};

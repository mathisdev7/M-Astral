"use server";
import { prisma } from "@/lib/prisma";

type NotifAction = "like" | "comment" | "follow" | "mention";

export const notification = async (
  authorId: string,
  userId: string,
  type: NotifAction,
  threadId?: string
) => {
  const author = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  let thread;
  if (threadId) {
    thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
    });
  }
  if (!author || !user) {
    return await prisma.$disconnect();
  }
  if (authorId === userId) {
    return await prisma.$disconnect();
  }
  switch (type) {
    case "like":
      const notificationAlreadyExistsLike = await prisma.notification.findFirst(
        {
          where: {
            userId,
            content: `${author?.username} liked your post.`,
            threadId,
          },
        }
      );
      if (notificationAlreadyExistsLike) {
        return await prisma.$disconnect();
      }
      await prisma.notification.create({
        data: {
          userId,
          authorId,
          threadId,
          content: `${author?.username} liked your post.`,
          image: thread?.image,
        },
      });
      break;
    case "comment":
      await prisma.notification.create({
        data: {
          userId,
          authorId,
          threadId,
          content: `${author?.username} commented on your post.`,
          image: thread?.image,
        },
      });
      break;
    case "follow":
      const notificationAlreadyExistsFollow =
        await prisma.notification.findFirst({
          where: {
            userId,
            content: `Hey ${user?.username}! ${author?.username} followed you.`,
          },
        });
      if (notificationAlreadyExistsFollow) {
        return await prisma.$disconnect();
      }
      await prisma.notification.create({
        data: {
          userId,
          authorId,
          content: `Hey ${user?.username}! ${author?.username} followed you.`,
        },
      });
      break;
    case "mention":
      await prisma.notification.create({
        data: {
          userId,
          authorId,
          content: `${author?.username} mentioned you in a post.`,
          image: thread?.image,
        },
      });
      break;
  }
  return await prisma.$disconnect();
};

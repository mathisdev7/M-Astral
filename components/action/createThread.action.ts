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
  const author = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
  if (!author) {
    prisma.$disconnect();
    throw new Error("Author not found");
  }

  if (!image) {
    const thread = await prisma.thread.create({
      data: {
        authorId,
        content,
      },
    });
    if (
      content
        .split(" ")
        .map((word) => word.startsWith("@"))
        .includes(true)
    ) {
      const mentions = content
        .split(" ")
        .filter((word) => word.startsWith("@"))
        .map((mention) => mention.slice(1));
      console.log(mentions);
      for (const mention of mentions) {
        const user = await prisma.user.findUnique({
          where: {
            username: "@" + mention,
          },
        });
        if (user) {
          await prisma.notification.create({
            data: {
              userId: user.id,
              authorId,
              threadId: thread.id,
              content: `${author.username} mentioned you in a post.`,
              image: thread.image,
            },
          });
        }
      }
    }
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

  if (
    content
      .split(" ")
      .map((word) => word.startsWith("@"))
      .includes(true)
  ) {
    const mentions = content
      .split(" ")
      .filter((word) => word.startsWith("@"))
      .map((mention) => mention.slice(1));
    for (const mention of mentions) {
      const user = await prisma.user.findUnique({
        where: {
          username: "@" + mention,
        },
      });
      if (user) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            authorId,
            threadId: thread.id,
            content: `${author.username} mentioned you in a post.`,
            image: thread.image,
          },
        });
      }
    }
  }

  prisma.$disconnect();
  return thread;
};

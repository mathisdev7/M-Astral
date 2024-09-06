"use server";
import { prisma } from "@/lib/prisma";

const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

const createNotificationForUser = async (
  userId: string,
  authorId: string,
  threadId: string,
  content: string,
  image: string
) => {
  await prisma.notification.create({
    data: {
      userId,
      authorId,
      threadId,
      content,
      image,
    },
  });
};

const extractMentions = (content: string) => {
  return content
    .split(" ")
    .filter((word) => word.startsWith("@"))
    .map((mention) => mention.slice(1));
};

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

  const thread = await prisma.thread.create({
    data: {
      authorId,
      content,
      image: image || null,
    },
  });

  const mentions = extractMentions(content);

  for (const mention of mentions) {
    const user = await findUserByUsername("@" + mention);

    if (user) {
      await createNotificationForUser(
        user.id,
        authorId,
        thread.id,
        `${author.username} mentioned you in a post.`,
        image || thread?.image || ""
      );
    }
  }

  prisma.$disconnect();
  return thread;
};

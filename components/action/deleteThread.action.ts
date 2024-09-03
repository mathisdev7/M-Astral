"use server";
import { prisma } from "@/lib/prisma";

export const deleteThread = async (threadId: string) => {
  if (!threadId) {
    prisma.$disconnect();
    throw new Error("Thread ID is required");
  }

  await prisma.thread.delete({
    where: {
      id: threadId,
    },
  });
  prisma.$disconnect();
  return true;
};

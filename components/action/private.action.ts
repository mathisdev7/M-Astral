"use server";
import { prisma } from "@/lib/prisma";

export const setPrivate = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return await prisma.$disconnect();
  }
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      private: !user.private,
    },
  });
  return await prisma.$disconnect();
};

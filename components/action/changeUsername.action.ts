"use server";
import { prisma } from "@/lib/prisma";

export const changeUsername = async (username: string, id: string) => {
  const usernameExists = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  if (usernameExists) {
    throw new Error("Username already exists.");
  }
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });
  return user;
};

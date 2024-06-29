"use server";
import { prisma } from "@/lib/prisma";

export const editUser = async (userId: any, data: any) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    throw new Error("User not found.");
  }
  await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
  const userUpdated = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      location: true,
      url: true,
    },
  });
  return userUpdated;
};

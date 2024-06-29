"use server";
import { prisma } from "@/lib/prisma";

export const changeAvatar = async (id: string, image: string) => {
  if (!image.startsWith("http")) {
    throw new Error("Invalid image url");
  }
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      image,
    },
  });
  return user;
};

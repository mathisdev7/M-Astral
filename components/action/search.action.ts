"use server";
import { prisma } from "@/lib/prisma";

export const search = async (search: string) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    take: 8,
  });
  prisma.$disconnect();
  return users;
};

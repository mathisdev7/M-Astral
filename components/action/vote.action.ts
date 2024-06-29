"use server";
import { prisma } from "@/lib/prisma";

export const votePost = async (
  choice: "firstChoice" | "secondChoice",
  authorId: string,
  postId: string
) => {
  const alreadyVoted = await prisma.vote.findFirst({
    where: {
      postId,
      authorId,
    },
  });
  if (alreadyVoted) {
    return null;
  }
  const choiceValue = choice === "firstChoice" ? 1 : 2;
  const vote = await prisma.vote.create({
    data: {
      choice: choiceValue,
      postId,
      authorId,
    },
  });
  const postUpdated = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      [choice]: {
        increment: 1,
      },
    },
  });
  return postUpdated;
};

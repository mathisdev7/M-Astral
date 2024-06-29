"use server";

import Section from "@/components/landing/Section";
import PostDetails from "@/components/post/Post";
import { prisma } from "@/lib/prisma";

export default async function Post({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
      published: true,
    },
  });
  if (!post) return null;
  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
    },
  });
  const upVotes = await prisma.upVote.findMany({
    where: {
      postId: post.id,
    },
  });
  const downVotes = await prisma.downVote.findMany({
    where: {
      postId: post.id,
    },
  });
  return (
    <main>
      <div className="flex-1 flex flex-row">
        <div className="h-full w-full flex justify-center flex-row">
          <div className="relative right-24 hidden lg:block">
            <div className="flex justify-center items-center">
              <Section />
            </div>
          </div>
          <div className="flex justify-center items-center relative lg:right-24">
            <PostDetails
              post={post}
              comments={comments}
              upVotes={upVotes}
              downVotes={downVotes}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

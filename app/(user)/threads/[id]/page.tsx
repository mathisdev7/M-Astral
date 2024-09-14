"use server";

import { auth } from "@/auth/auth";
import SignIn from "@/components/errors/SignIn";
import ThreadDetails from "@/components/thread/ThreadDetails";
import { prisma } from "@/lib/prisma";

type ThreadPageProps = {
  params: Readonly<{ id: string }>;
};

export default async function ThreadPage({
  params,
}: Readonly<ThreadPageProps>) {
  const session = await auth();
  if (!session) return <SignIn />;

  const thread = await prisma.thread.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: true,
      likes: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          likes: true,
        },
      },
    },
  });

  if (!thread)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl">Thread not found</h1>
      </div>
    );

  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId: session.user.id,
      followingId: thread.authorId,
    },
  });

  const isFollowed = await prisma.follow.findFirst({
    where: {
      followerId: thread.authorId,
      followingId: session.user.id,
    },
  });

  const isAuthor = thread.author.id === session.user.id;
  const isVisible =
    !thread.author.private || (isFollowing && isFollowed) || isAuthor;

  if (!isVisible) {
    return (
      <main>
        <div className="flex flex-row justify-center items-center w-full h-full">
          <div className="h-full w-full flex justify-center items-center flex-row">
            <h1 className="text-2xl font-bold dark:text-white text-black relative top-6">
              This user's threads are private.
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex-1 flex flex-row">
        <div className="h-full w-full flex justify-center flex-row">
          <div className="relative right-24 hidden md:block"></div>
          <div className="flex justify-center items-center relative top-8">
            <ThreadDetails thread={thread} session={session} />
          </div>
        </div>
      </div>
    </main>
  );
}

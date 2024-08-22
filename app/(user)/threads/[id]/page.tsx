"use server";

import { auth } from "@/auth/auth";
import ThreadDetails from "@/components/thread/ThreadDetails";
import { prisma } from "@/lib/prisma";

export default async function Post({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session)
    return (
      <main>
        <div className="flex flex-row justify-center items-center w-full h-full">
          <div className="h-full w-full flex justify-center items-center flex-row">
            <h1 className="text-2xl font-bold dark:text-white text-black relative top-6">
              Please sign in to view this page.
            </h1>
          </div>
        </div>
      </main>
    );
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
  if (!thread) return null;
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

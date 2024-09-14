"use server";

import { auth } from "@/auth/auth";
import SignIn from "@/components/errors/SignIn";
import { HomePage } from "@/components/landing/LazyLoading";
import { ThreadProvider } from "@/components/landing/ThreadContext";
import { prisma } from "@/lib/prisma";

type HashtagPageParams = {
  params: {
    hashtag: string;
  };
};
export default async function HashtagPage({
  params,
}: Readonly<HashtagPageParams>) {
  const hashtag = params.hashtag;
  const session = await auth();
  if (!session) return <SignIn />;
  const threadsWithHashtag = await prisma.thread.findMany({
    where: {
      content: {
        contains: `#${hashtag}`,
      },
      author: {
        private: false,
      },
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      author: true,
      likes: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });
  return (
    <main className="flex flex-col justify-center items-center w-full h-full relative top-4">
      <h1 className="text-4xl text-blue-500 ">#{hashtag}</h1>
      <h2 className="text-xs text-gray-500">
        {threadsWithHashtag.length} post
        {threadsWithHashtag.length === 1 ? "" : "s"}
      </h2>
      <div className="border-b h-4 max-w-48 w-full"></div>
      <div className="h-full w-full flex justify-center items-center flex-row">
        {threadsWithHashtag.length > 0 ? (
          <div className="flex justify-center items-center relative">
            <ThreadProvider
              initialThreads={threadsWithHashtag}
              session={session}
            >
              <HomePage session={session} />
            </ThreadProvider>{" "}
          </div>
        ) : (
          <div className="flex justify-center relative">
            <h1 className="text-2xl font-bold dark:text-white text-black">
              No posts found.
            </h1>
          </div>
        )}
      </div>{" "}
    </main>
  );
}

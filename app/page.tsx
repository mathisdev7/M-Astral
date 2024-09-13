"use server";
import { auth } from "@/auth/auth";
import { HomePage } from "@/components/landing/LazyLoading";
import { ThreadProvider } from "@/components/landing/ThreadContext";
import { prisma } from "@/lib/prisma";

const POSTS_PER_PAGE = 10;

export default async function Home() {
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

  const threads = await prisma.thread.findMany({
    take: POSTS_PER_PAGE,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      OR: [
        {
          author: {
            private: false,
          },
        },
        {
          AND: [
            {
              author: {
                followers: {
                  some: {
                    followingId: session.user.id,
                  },
                },
              },
            },
            {
              author: {
                following: {
                  some: {
                    followerId: session.user.id,
                  },
                },
              },
            },
          ],
        },
      ],
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
    <main>
      <div className="flex flex-row justify-center items-center w-full h-full overflow-hidden">
        <div className="h-full w-full flex justify-center items-center flex-row">
          {threads.length > 0 ? (
            <div className="flex justify-center items-center relative">
              <ThreadProvider initialThreads={threads} session={session}>
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
        </div>
      </div>
    </main>
  );
}

"use server";
import { auth } from "@/auth/auth";
import SignIn from "@/components/errors/SignIn";
import { HomePage } from "@/components/landing/LazyLoading";
import { ThreadProvider } from "@/components/landing/ThreadContext";
import { prisma } from "@/lib/prisma";
import { Comment, Like, Thread, User } from "@prisma/client";

const POSTS_PER_PAGE = 10;
type ThreadWithAuthorAndComments = Thread & {
  author: User;
  likes: Like[];
  comments: Comment[];
};

export default async function Home() {
  const session = await auth();
  if (!session) return <SignIn />;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      interests: true,
    },
  });

  let threads: ThreadWithAuthorAndComments[];
  if (user?.interests && user.interests.length > 0) {
    threads = await prisma.thread.findMany({
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
    const categoryScores: Record<string, BigInt> = user.interests.reduce(
      (acc, interest) => {
        const score =
          BigInt(interest.like ?? 0) +
          BigInt(interest.comment ?? 0) +
          BigInt(interest.thread ?? 0);
        if (acc[interest.category]) {
          Number(acc[interest.category]) + Number(score);
        } else {
          acc[interest.category] = score;
        }
        return acc;
      },
      {} as Record<string, BigInt>
    );

    const bestCategory = Object.keys(categoryScores).reduce(
      (best, category) => {
        if (categoryScores[category] > (categoryScores[best] ?? BigInt(0))) {
          return category;
        }
        return best;
      },
      ""
    );

    threads = await prisma.thread.findMany({
      take: POSTS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        category: {
          has: bestCategory,
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
  } else {
    threads = await prisma.thread.findMany({
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
  }

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

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { Comment, Like, Thread } from "@prisma/client";
import { NextResponse } from "next/server";

type ThreadWithAuthorAndComments = Thread & {
  author: {
    id: string;
    username: string | null;
    name: string | null;
    verified: boolean;
    image: string | null;
  };
  likes: Like[];
  comments: Comment[];
};

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") as string;
    const pageNumber = parseInt(page) || 1;
    const POSTS_PER_PAGE = 10;
    const session = await auth();
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Please sign in to view this page." }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
        skip: POSTS_PER_PAGE * (pageNumber - 1),
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
        select: {
          category: true,
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          authorId: true,
          likes: true,
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  verified: true,
                  image: true,
                },
              },
              content: true,
              createdAt: true,
              id: true,
              likes: true,
              updatedAt: true,
              authorId: true,
              threadId: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              verified: true,
              image: true,
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
        skip: POSTS_PER_PAGE * (pageNumber - 1),
        orderBy: {
          createdAt: "desc",
        },
        where: {
          category: {
            has: bestCategory,
          },
        },
        select: {
          category: true,
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          authorId: true,
          likes: true,
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  verified: true,
                  image: true,
                },
              },
              content: true,
              createdAt: true,
              id: true,
              likes: true,
              updatedAt: true,
              authorId: true,
              threadId: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              verified: true,
              image: true,
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
        select: {
          category: true,
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          authorId: true,
          likes: true,
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  verified: true,
                  image: true,
                },
              },
              content: true,
              createdAt: true,
              id: true,
              likes: true,
              updatedAt: true,
              authorId: true,
              threadId: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              verified: true,
              image: true,
            },
          },
        },
      });
    }
    return new NextResponse(JSON.stringify(threads), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const threads = await prisma.thread.findMany({
      skip: (pageNumber - 1) * POSTS_PER_PAGE,
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

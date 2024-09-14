import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") as string;
    const pageNumber = parseInt(page) || 1;
    const POSTS_PER_PAGE = 10;

    const threads = await prisma.thread.findMany({
      skip: (pageNumber - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        authorId: true,
        likes: true,
        comments: {
          include: {
            author: true,
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

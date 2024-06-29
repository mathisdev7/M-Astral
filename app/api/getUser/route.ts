import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url as string);
  if (!searchParams.has("userId")) {
    return new NextResponse(
      JSON.stringify({ error: "userId query param is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      id: searchParams.get("userId") as string,
    },
    select: {
      id: true,
      name: true,
      email: false,
      image: true,
    },
  });
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new NextResponse(JSON.stringify({ user }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

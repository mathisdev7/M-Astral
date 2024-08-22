"use server";
import { auth } from "@/auth/auth";
import { Threads } from "@/components/landing/Threads";
import Username from "@/components/landing/Username";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const threads = await prisma.thread.findMany({
    orderBy: {
      createdAt: "desc",
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
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  await prisma.$disconnect();
  if (user?.id && !user.username) return <Username userId={user.id} />;

  return (
    <main>
      <div className="flex flex-row justify-center items-center w-full h-full overflow-hidden">
        <div className="h-full w-full flex justify-center items-center flex-row">
          {threads.length > 0 ? (
            <div className="flex justify-center items-center relative">
              <Threads threads={threads} session={session} />
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

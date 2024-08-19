"use server";

import { auth } from "@/auth/auth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FollowSection from "@/components/user/FollowSection";
import Section from "@/components/user/Section";
import { prisma } from "@/lib/prisma";
import { X } from "lucide-react";
import Image from "next/image";

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const session = await auth();
  let author;
  if (session) {
    author = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });
  } else {
    author = null;
  }
  const usernameDecoded = decodeURIComponent(params.username);
  const user = await prisma.user.findUnique({
    where: {
      username: usernameDecoded,
    },
    include: {
      followers: true,
      following: true,
    },
  });
  if (!user) return null;
  const userThreads = await prisma.thread.findMany({
    where: {
      authorId: user.id,
    },
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
  await prisma.$disconnect();
  if (!user) return null;
  return (
    <main className="w-full h-full">
      <div className="flex flex-row justify-center items-center lg:w-full h-full p-4">
        <div className="h-full w-full flex justify-center items-center flex-row">
          <div className="flex justify-center items-center relative w-4/6 lg:w-1/5">
            <section className="flex flex-col justify-center items-start w-full">
              <div className="flex flex-row justify-center items-center w-full">
                <section className="flex flex-col justify-center items-start w-full">
                  <h1 className="text-2xl dark:text-white text-black">
                    {user.name}
                  </h1>
                  <h1 className="text-[0.85rem] font-light text-[#777]">
                    {user.username}
                  </h1>
                </section>
                <div className="w-28">
                  <AlertDialog>
                    <AlertDialogTrigger className="w-auto rounded-full">
                      <Image
                        src={user?.image || "/default.png"}
                        alt="user profile picture"
                        width={200}
                        height={200}
                        className="rounded-full size-20"
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <Image
                        src={user?.image || "/default.png"}
                        alt="user profile picture"
                        width={200}
                        height={200}
                        className="w-full"
                      />
                      <AlertDialogCancel className="w-auto h-auto">
                        <X />
                      </AlertDialogCancel>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="text-sm dark:text-white text-black relative top-2 w-60">
                {user.bio || "No biography"}
              </p>
              <p className="text-[0.9rem] text-[#777] relative top-5 w-60">
                {user.followers.length} followers • {user.following.length}{" "}
                following
              </p>
              <FollowSection user={user} author={author} />
            </section>
          </div>
        </div>
      </div>
      <Section session={session} userThreads={userThreads} />
    </main>
  );
}

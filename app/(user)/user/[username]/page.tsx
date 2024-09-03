"use server";

import { auth } from "@/auth/auth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FollowSection from "@/components/user/FollowSection";
import Section from "@/components/user/Section";
import { prisma } from "@/lib/prisma";
import { BadgeCheck, Link, MapPin, X } from "lucide-react";
import Image from "next/image";

const fetchData = async (username: string) => {
  const session = await auth();
  const authorPromise = session
    ? prisma.user.findUnique({ where: { id: session.user.id } })
    : Promise.resolve(null);
  const userPromise = prisma.user.findUnique({
    where: { username: decodeURIComponent(username) },
    include: {
      followers: {
        include: {
          follower: true,
          following: true,
        },
      },
      following: {
        include: {
          following: true,
          follower: true,
        },
      },
      threads: {
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          likes: true,
          comments: { include: { author: true } },
        },
      },
      likes: {
        include: {
          thread: {
            include: {
              author: true,
              likes: true,
              comments: { include: { author: true } },
            },
          },
        },
      },
    },
  });

  const [author, user] = await Promise.all([authorPromise, userPromise]);

  return { author, user, session };
};

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const { author, user, session } = await fetchData(params.username);

  if (!user) {
    console.error("User not found or error fetching user.");
    return (
      <div>
        <h1 className="text-2xl dark:text-white text-black text-center">
          User not found
        </h1>
      </div>
    );
  }

  return (
    <main>
      <div className="flex flex-row justify-center items-center w-full h-full p-4">
        <section className="flex flex-col justify-center items-start w-10/12 md:w-1/4">
          <div className="flex flex-row justify-center items-center w-full">
            <section className="flex flex-col justify-center items-start w-11/12">
              <h1 className="text-2xl dark:text-white text-black">
                {user.name}
              </h1>
              <h1 className="text-[0.85rem] font-light text-[#777]">
                {user.username}
                {user.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BadgeCheck className="inline-block size-4 ml-1 mb-1 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This user is verified by F'Threads</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </h1>
            </section>
            <div className="w-28">
              <AlertDialog>
                <AlertDialogTrigger className="w-auto rounded-full">
                  <Image
                    src={user?.image || "/default.png"}
                    alt="user profile picture"
                    width={800}
                    height={800}
                    className="rounded-full size-20"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <Image
                    src={user?.image || "/default.png"}
                    alt="user profile picture"
                    width={800}
                    height={800}
                    className="w-full"
                  />
                  <AlertDialogCancel className="w-auto h-auto">
                    <X />
                  </AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {user.location && (
            <p className="text-[0.85rem] w-48 font-light text-[#777]">
              <MapPin className="inline-block size-4 mr-px" />{" "}
              <span className="relative top-[1.6px]">{user.location}</span>
            </p>
          )}
          {user.url && (
            <p className="text-[0.85rem] w-48 font-light truncate text-[#777]">
              <Link className="inline-block size-4 mr-px" />{" "}
              <a
                href={user.url}
                target="_blank"
                rel="noreferrer"
                className="relative top-[1.6px]"
              >
                {user.url}
              </a>{" "}
            </p>
          )}
          <p className="text-sm dark:text-white text-black relative top-2 w-60">
            {user.bio || "No biography"}
          </p>
          <p className="text-[0.9rem] text-[#777] relative top-5 w-60">
            <AlertDialog>
              <AlertDialogTrigger className="w-auto">
                <span>
                  {user.followers.length} follower
                  {user.followers.length > 1 ? "s" : ""} •
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <h1 className="text-xl dark:text-white text-black text-center">
                  <span className="font-bold">{user.name}</span> •{" "}
                  {user.followers.length} follower
                  {user.followers.length > 1 ? "s" : ""}
                </h1>
                <ScrollArea className="flex flex-col justify-center items-center p-2 w-full h-64">
                  {user.followers.map((follower) => (
                    <a
                      href={`/user/${follower.follower.username}`}
                      key={follower.follower.id}
                      className="flex flex-row justify-center items-center space-x-2 p-2.5 w-full h-full"
                    >
                      <div>
                        <Image
                          src={follower.follower.image || "/default.png"}
                          alt="user profile picture"
                          width={50}
                          height={50}
                          className="rounded-full size-10"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-start">
                        <h1 className="text-sm dark:text-white text-black">
                          {follower.follower.name}
                        </h1>
                        <h1 className="text-[0.85rem] font-light text-[#777]">
                          {follower.follower.username}
                        </h1>
                      </div>
                    </a>
                  ))}
                </ScrollArea>
                <AlertDialogCancel className="w-auto h-auto">
                  <X />
                </AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger className="w-auto">
                &nbsp;
                <span>{user.following.length} following</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <h1 className="text-xl dark:text-white text-black text-center">
                  <span className="font-bold">{user.name}</span> • Following{" "}
                  {user.following.length}
                </h1>
                <ScrollArea className="flex flex-col justify-center items-center p-2 w-full h-64">
                  {user.following.map((following) => (
                    <a
                      key={following.id}
                      href={`/user/${following.follower.username}`}
                      className="flex flex-row justify-center items-center space-x-2 p-2.5 w-full h-full"
                    >
                      <div>
                        <Image
                          src={following.follower.image || "/default.png"}
                          alt="user profile picture"
                          width={50}
                          height={50}
                          className="rounded-full size-10"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-start">
                        <h1 className="text-sm dark:text-white text-black">
                          {following.follower.name}
                        </h1>
                        <h1 className="text-[0.85rem] font-light text-[#777]">
                          {following.follower.username}
                        </h1>
                      </div>
                    </a>
                  ))}
                </ScrollArea>
                <AlertDialogCancel className="w-auto h-auto">
                  <X />
                </AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>{" "}
          </p>
          <FollowSection user={user} author={author} />
        </section>
      </div>
      <Section
        session={session}
        userThreads={user.threads}
        userLikedThreads={user.likes}
      />
    </main>
  );
}

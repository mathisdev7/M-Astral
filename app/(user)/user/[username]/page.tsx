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
import type { Follow, Like, Thread, User } from "@prisma/client";
import { BadgeCheck, Link, Lock, MapPin, X } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";

type ThreadWithAuthor = Thread & {
  author: User;
  likes: Like[];
};

type ThreadWithAuthorAndComments = ThreadWithAuthor & {
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    threadId: string;
    authorId: string;
  }[];
};

type LikedThread = {
  thread: ThreadWithAuthorAndComments;
  userId: string;
  id: string;
  threadId: string;
};

type UserWithThreadsAndLikes = User & {
  threads: ThreadWithAuthorAndComments[];
  likes: LikedThread[];
};

type FollowWithUser = Follow & {
  follower: UserWithThreadsAndLikes;
  following: UserWithThreadsAndLikes;
};

type UserWithFollowersAndFollowing = UserWithThreadsAndLikes & {
  followers: FollowWithUser[];
  following: FollowWithUser[];
};

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

const createNotificationIfNeeded = async (
  author: User | null,
  user: UserWithFollowersAndFollowing | null
) => {
  if (author?.profileViews && user?.profileViews && author.id !== user.id) {
    const lastNotification = await prisma.notification.findFirst({
      where: {
        userId: user.id,
        authorId: author.id,
        content: `${author.username} visited your profile`,
      },
    });

    if (
      !lastNotification ||
      lastNotification.createdAt < new Date(Date.now() - 86400000)
    ) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          authorId: author.id,
          content: `${author.username} visited your profile`,
        },
      });
    }
  }
};

const checkFollowingStatus = (
  user: UserWithFollowersAndFollowing | null,
  author: User | null
) => {
  const isFollowing =
    user?.followers.some(
      (follower: Follow) => follower.followingId === author?.id
    ) || false;

  const isFollowed =
    user?.following.some(
      (following: Follow) => following.followerId === author?.id
    ) || false;

  return { isFollowing, isFollowed };
};

const renderUserNotFound = () => (
  <div>
    <h1 className="text-2xl dark:text-white text-black text-center">
      User not found
    </h1>
  </div>
);

const renderSignInPrompt = () => (
  <main>
    <div className="flex flex-row justify-center items-center w-full h-full">
      <div className="h-full w-full flex justify-center items-center flex-row">
        <h1 className="text-2xl dark:text-white text-black relative top-6">
          Please sign in to view this page.
        </h1>
      </div>
    </div>
  </main>
);

const renderProfileSections = (
  user: UserWithFollowersAndFollowing,
  author: User,
  session: Session
) => {
  const { isFollowing, isFollowed } = checkFollowingStatus(user, author);

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
                        <p>This user is verified by M'Astral</p>
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
                    src={user?.image ?? "/default.png"}
                    alt="user profile picture"
                    width={800}
                    height={800}
                    className="rounded-full size-20"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <Image
                    src={user?.image ?? "/default.png"}
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
            {user.bio ?? "No biography"}
          </p>
          <p className="text-[0.9rem] text-[#777] relative top-5 w-60 space-x-1">
            {(isFollowed && isFollowing) ||
            user.id === session?.user.id ||
            !user.private ? (
              <AlertDialog>
                <AlertDialogTrigger className="w-auto">
                  <span>
                    {user.followers.length} follower
                    {user.followers.length > 1 ? "s" : ""} •{" "}
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <h1 className="text-xl dark:text-white text-black text-center">
                    <span className="font-bold">{user.name}</span> •{" "}
                    {user.followers.length} follower
                    {user.followers.length > 1 ? "s" : ""}{" "}
                  </h1>
                  <ScrollArea className="flex flex-col justify-center items-center p-2 w-full h-64">
                    {user.followers.map((follower) => (
                      <a
                        href={`/user/${follower.following.username}`}
                        key={follower.following.id}
                        className="flex flex-row justify-center items-center space-x-2 p-2.5 w-full h-full"
                      >
                        <div>
                          <Image
                            src={follower.following.image ?? "/default.png"}
                            alt="user profile picture"
                            width={50}
                            height={50}
                            className="rounded-full size-10"
                          />
                        </div>
                        <div className="flex flex-col justify-center items-start">
                          <h1 className="text-sm dark:text-white text-black">
                            {follower.following.name}
                          </h1>
                          <h1 className="text-[0.85rem] font-light text-[#777]">
                            {follower.following.username}
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
            ) : (
              <span className="text-[0.9rem] text-[#777]">
                {user.followers.length} follower
                {user.followers.length > 1 ? "s" : ""} •
              </span>
            )}
            {(isFollowed && isFollowing) ||
            user.id === session?.user.id ||
            !user.private ? (
              <AlertDialog>
                <AlertDialogTrigger className="w-auto">
                  {" "}
                  <span>{user.following.length} following</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <h1 className="text-xl dark:text-white text-black text-center">
                    {" "}
                    <span className="font-bold">{user.name}</span> •{" "}
                    {user.following.length} following
                  </h1>
                  <ScrollArea className="flex flex-col justify-center items-center p-2 w-full h-64">
                    {user.following.map((follower) => (
                      <a
                        href={`/user/${follower.follower.username}`}
                        key={follower.follower.id}
                        className="flex flex-row justify-center items-center space-x-2 p-2.5 w-full h-full"
                      >
                        <div>
                          <Image
                            src={follower.follower.image ?? "/default.png"}
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
            ) : (
              <span className="text-[0.9rem] text-[#777]">
                {" "}
                {user.following.length} following
              </span>
            )}
          </p>
          <FollowSection user={user} author={author} />
        </section>{" "}
      </div>
      {(isFollowed && isFollowing) ||
      user.id === session?.user.id ||
      !user.private ? (
        <Section
          session={session}
          userThreads={user.threads}
          userLikedThreads={user.likes}
        />
      ) : (
        <div className="flex flex-col justify-center items-center w-full relative gap-4 top-7 p-1">
          <div className="border-t w-3/4 md:w-1/4"></div>
          <Lock className="size-10" />
          <p className="text-xl dark:text-white text-black">
            This user's threads are private.
          </p>
        </div>
      )}
    </main>
  );
};

// Main User component
export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const { author, user, session } = await fetchData(params.username);

  if (!user) {
    console.error("User not found or error fetching user.");
    return renderUserNotFound();
  }

  if (!session) {
    return renderSignInPrompt();
  }

  await createNotificationIfNeeded(
    author,
    user as unknown as UserWithFollowersAndFollowing
  );

  return renderProfileSections(
    user as unknown as UserWithFollowersAndFollowing,
    author as User,
    session
  );
}

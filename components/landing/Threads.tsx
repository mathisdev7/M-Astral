"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import PrismaTypes from "@prisma/client";
import { Heart, MessageSquare, MoreHorizontal, X } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { like } from "../action/like.action";

type ThreadWithAuthor = PrismaTypes.Thread & {
  author: PrismaTypes.User;
  likes: PrismaTypes.Like[];
};

type ThreadWithAuthorAndComments = ThreadWithAuthor & {
  comments: PrismaTypes.Comment[];
};

export const Threads = ({
  threads,
  session,
}: {
  threads: ThreadWithAuthorAndComments[];
  session: Session | null;
}) => {
  const router = useRouter();
  const handleLike = (threadId: string) => {
    if (!session) return;
    like(session?.user.id as string, threadId);
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center first:pt-4 last:pb-6">
      {threads.map((post) => (
        <div
          key={post.id}
          className="flex flex-col items-center justify-center lg:w-full hover:bg-background/70 cursor-pointer"
        >
          <div className="flex flex-col items-start justify-center w-full h-full relative">
            <div className="flex flex-row items-center justify-center gap-2 pb-1 relative right-4 sm:right-10">
              <Image
                onClick={() => {
                  router.push(`/user/${post.author.username}`);
                }}
                src={
                  post.author.image
                    ? post.author.image
                    : "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"
                }
                alt="author avatar"
                width={20}
                height={20}
                className="rounded-full size-8"
              />
              <span
                onClick={() => {
                  router.push(`/user/${post.author.username}`);
                }}
                className="text-sm font-bold dark:text-white text-black truncate relative bottom-px"
              >
                {post.author.name}
              </span>
              <span className="text-xs text-gray-500 truncate relative right-px">
                {formatRelativeTime(post.createdAt)} ago
              </span>
              <MoreHorizontal className="size-5 relative left-48 text-gray-500 bottom-2" />
            </div>
            <span
              onClick={() => router.push(`/threads/${post.id}`)}
              className="text-sm dark:text-white text-black py-2 lg:py-1 w-80 relative bottom-2 lg:bottom-3"
            >
              {post.content}
            </span>
          </div>
          {post.image ? (
            <div className="w-full h-52">
              <AlertDialog>
                <AlertDialogTrigger className="w-full h-52 cursor-pointer rounded-lg">
                  <Image
                    src={
                      post.image ||
                      "https://d3rqy6w6tyyf68.cloudfront.net/AcuCustom/Sitename/DAM/135/scw-126-a-deep-dive-into-a-goalkeepers-roles-1.png"
                    }
                    width={300}
                    height={200}
                    alt="post image"
                    className="w-full h-52 object-cover rounded-lg py-1 relative bottom-4"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <Image
                    src={
                      post.image ||
                      "https://d3rqy6w6tyyf68.cloudfront.net/AcuCustom/Sitename/DAM/135/scw-126-a-deep-dive-into-a-goalkeepers-roles-1.png"
                    }
                    width={300}
                    height={200}
                    alt="post image"
                    className="w-full h-full object-cover rounded-lg py-1 relative bottom-4"
                  />
                  <AlertDialogCancel className="w-auto h-auto">
                    <X />
                  </AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
          <div className="flex flex-row items-center justify-start gap-2 py-2 w-full relative bottom-4">
            <div className="w-auto h-auto">
              {post.likes.find((like) => like.userId === session?.user.id) ? (
                <Heart
                  className="size-5 dark:text-[#ff0000]"
                  fill="red"
                  onClick={() => handleLike(post.id)}
                />
              ) : (
                <Heart
                  onClick={() => handleLike(post.id)}
                  className="size-5 dark:text-white"
                />
              )}
            </div>
            <div>
              <span className="text-gray-500">‧</span>
            </div>
            <div>
              <MessageSquare
                className="size-5 dark:text-white relative top-[0.5px]"
                onClick={() => router.push(`/threads/${post.id}`)}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-start gap-1 py-2 w-full relative bottom-8">
            <div>
              <span className="text-xs text-gray-500 relative top-px">
                {post.likes.length} like{post.likes.length > 1 ? "s" : ""}
              </span>
            </div>
            <div>
              <span className="text-gray-500 relative top-1">‧</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 relative top-px">
                {post.comments.length} comment
                {post.comments.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div
            className="w-full border-b relative bottom-6"
            style={{ width: `calc(100% + 5rem)` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

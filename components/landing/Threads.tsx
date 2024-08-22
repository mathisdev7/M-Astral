"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import PrismaTypes from "@prisma/client";
import { Heart, MessageSquare, X } from "lucide-react";
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
    <main className="flex flex-col items-center justify-center md:w-full h-full first:pt-2 last:pb-11">
      {threads.map((post) => (
        <div
          key={post.id}
          className="flex flex-col items-center justify-center w-full hover:bg-background/70 cursor-pointer z-30 p-1"
        >
          <div className="flex flex-row items-center justify-center w-full gap-2 border-b-2">
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
              width={1000}
              height={1000}
              className="rounded-full size-10 self-start"
            />
            <div className="flex flex-col items-start justify-center w-full relative">
              <div className="flex flex-row w-full gap-48 md:gap-64">
                <span
                  onClick={() => {
                    router.push(`/user/${post.author.username}`);
                  }}
                  className="text-sm font-bold dark:text-white text-black relative w-auto"
                >
                  {post.author.name}
                </span>
                <span className="text-xs text-gray-500 relative top-1">
                  {formatRelativeTime(post.createdAt)} ago
                </span>
              </div>
              <span
                className="text-sm dark:text-white text-black w-72 pb-1 md:w-80 text-wrap"
                onClick={() => router.push(`/threads/${post.id}`)}
              >
                {post.content}
              </span>
              {post.image ? (
                <div className="w-full h-52">
                  <AlertDialog>
                    <AlertDialogTrigger className="w-auto rounded-full">
                      <Image
                        src={post?.image || "/default.png"}
                        alt="post image preview"
                        width={1000}
                        height={1000}
                        className="w-80 h-52 object-cover rounded-xl"
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <Image
                        src={post?.image || "/default.png"}
                        alt="post image full size"
                        width={2000}
                        height={2000}
                        className="w-full"
                      />
                      <AlertDialogCancel className="w-auto h-auto">
                        <X />
                      </AlertDialogCancel>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : null}
              <div className="flex flex-row items-center justify-start gap-2 pt-0.5 w-full">
                <div className="w-auto h-auto">
                  {post.likes.find(
                    (like) => like.userId === session?.user.id
                  ) ? (
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
              <div className="flex flex-row items-center justify-start gap-1 pt-0.5 pb-3 w-full">
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
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

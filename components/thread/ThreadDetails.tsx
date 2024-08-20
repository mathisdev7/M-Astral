"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import PrismaTypes from "@prisma/client";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { comment as commentAction } from "../action/comment.action";
import { commentLike } from "../action/commentLike.action";
import { like } from "../action/like.action";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type CommentWithAuthorAndLikes = PrismaTypes.Comment & {
  author: PrismaTypes.User;
  likes: PrismaTypes.CommentLike[];
};

type ThreadWithAuthor = PrismaTypes.Thread & {
  author: PrismaTypes.User;
  likes: PrismaTypes.Like[];
  comments: CommentWithAuthorAndLikes[];
};

export default function ThreadDetails({
  thread,
  session,
}: {
  thread: ThreadWithAuthor;
  session: Session;
}) {
  const post = thread;
  const [comment, setComment] = useState<string>("");
  const router = useRouter();
  const handleLike = (threadId: string) => {
    like(session?.user.id as string, threadId);
    router.refresh();
  };
  const handleCommentLike = (commentId: string) => {
    commentLike(session?.user.id as string, commentId);
    router.refresh();
  };
  const handleComment = async (threadId: string) => {
    await commentAction(session?.user.id as string, threadId, comment);
    router.refresh();
  };
  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center lg:w-full hover:bg-background/70 cursor-pointer z-30">
        <div className="flex flex-col items-start justify-center lg:w-full h-full relative">
          <div className="flex flex-row items-center justify-center gap-2 pb-1 relative right-10">
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
              className="rounded-full size-8 z-40"
            />
            <span
              onClick={() => {
                router.push(`/user/${post.author.username}`);
              }}
              className="text-sm font-bold dark:text-white text-black truncate relative"
            >
              {post.author.name}
            </span>
            <span className="text-xs text-gray-500 truncate relative right-px">
              {formatRelativeTime(post.createdAt)} ago
            </span>
            <MoreHorizontal className="size-5 relative left-48 text-gray-500 bottom-2" />
          </div>
          <span className="text-sm dark:text-white text-black py-2 w-80 relative bottom-4">
            {post.content}
          </span>
        </div>
        {post.image ? (
          <div className="w-full h-52">
            <Image
              src={
                post.image ||
                "https://d3rqy6w6tyyf68.cloudfront.net/AcuCustom/Sitename/DAM/135/scw-126-a-deep-dive-into-a-goalkeepers-roles-1.png"
              }
              width={300}
              height={200}
              alt="post image"
              className="w-full h-full object-cover rounded-lg relative bottom-4"
            />
          </div>
        ) : null}
        <div className="flex flex-row items-center justify-start gap-2 py-2 w-full relative bottom-4">
          <div>
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
            <MessageSquare className="size-5 dark:text-white relative top-[0.5px]" />
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
        <Dialog>
          <DialogTrigger className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md p-2.5 text-sm relative bottom-4">
            Write a comment
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center p-2 pb-3">
                Write a comment
              </DialogTitle>
              <div className="flex items-center flex-col justify-center space-y-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Message
                  </Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    id="text"
                    placeholder="Write a comment"
                    className="w-80 h-20 rounded-lg border-1 border-gray-300 bg-white p-2 text-sm text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  />
                </div>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    size="sm"
                    onClick={() => handleComment(post.id)}
                    className="px-3 dark:text-black text-white"
                  >
                    Comment
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="border-t-2 p-4">
          <h1 className="text-2xl dark:text-white text-center text-black py-2 w-80 relative bottom-4">
            Comments
          </h1>
          {post.comments.map((comment, index) => (
            <div
              className="flex flex-col items-start justify-center w-full relative"
              key={comment.id}
            >
              <div className="flex flex-row items-center justify-center gap-2 pb-1 relative right-10">
                <Image
                  onClick={() => {
                    router.push(`/user/${post.author.username}`);
                  }}
                  src={
                    comment.author.image
                      ? comment.author.image
                      : "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"
                  }
                  alt="author avatar"
                  width={20}
                  height={20}
                  className="rounded-full size-8"
                />
                <span
                  onClick={() => {
                    router.push(`/user/${comment.author.username}`);
                  }}
                  className="text-sm font-bold dark:text-white text-black truncate relative w-auto"
                >
                  {comment.author.name}
                </span>
                <span className="text-xs text-gray-500 truncate relative right-px">
                  {formatRelativeTime(comment.createdAt)} ago
                </span>
                <MoreHorizontal className="size-5 relative left-48 text-gray-500 bottom-2" />
              </div>
              <span className="text-sm dark:text-white text-black py-2 w-80 relative bottom-4">
                {comment.content}
              </span>
              <div className="flex flex-row items-center justify-start gap-2 pb-2 w-full relative bottom-4">
                <div>
                  {comment.likes.find(
                    (like) => like.userId === session?.user.id
                  ) ? (
                    <Heart
                      className="size-5 dark:text-[#ff0000]"
                      fill="red"
                      onClick={() => handleCommentLike(comment.id)}
                    />
                  ) : (
                    <Heart
                      onClick={() => handleCommentLike(comment.id)}
                      className="size-5 dark:text-white"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center justify-start gap-1 py-2 w-full relative bottom-8">
                <div>
                  <span className="text-xs text-gray-500 relative top-px">
                    {comment.likes.length} like
                    {comment.likes.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

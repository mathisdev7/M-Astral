"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  BadgeCheck,
  Flag,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share,
  Trash2,
  X,
} from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { comment as commentAction } from "../action/comment.action";
import { commentLike } from "../action/commentLike.action";
import { deleteThread } from "../action/deleteThread.action";
import { like } from "../action/like.action";
import { notification } from "../action/notification.action";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type CommentWithAuthorAndLikes = PrismaTypes.Comment & {
  author: PrismaTypes.User;
  likes: PrismaTypes.CommentLike[];
};

type ThreadWithAuthor = PrismaTypes.Thread & {
  author: PrismaTypes.User;
  likes: PrismaTypes.Like[];
  comments: CommentWithAuthorAndLikes[];
};

type ThreadDetailsProps = {
  thread: ThreadWithAuthor;
  session: Session;
};

export default function ThreadDetails({
  thread,
  session,
}: Readonly<ThreadDetailsProps>) {
  const {
    id: threadId,
    author,
    content,
    image,
    createdAt,
    likes,
    comments,
  } = thread;
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  const handleLike = async () => {
    await like(session?.user.id, threadId);
    router.refresh();
  };

  const handleCommentLike = async (commentId: string) => {
    await commentLike(session?.user.id, commentId);
    router.refresh();
  };

  const handleComment = async () => {
    await commentAction(session?.user.id, threadId, comment);
    notification(session?.user.id, author.id, "comment", threadId);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!session) return;
    await deleteThread(threadId);
    router.push("/");
  };

  const renderContent = (text: string) =>
    text.split(/\s+/).map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <a
            key={index}
            className="text-blue-500 cursor-pointer"
            href={`/hashtag/${word.slice(1)}`}
            target="_blank"
          >
            {word}{" "}
          </a>
        );
      } else if (word.startsWith("@")) {
        return (
          <a
            key={index}
            className="text-blue-500 cursor-pointer"
            href={`/user/@${word.slice(1)}`}
            target="_blank"
          >
            {word}{" "}
          </a>
        );
      } else if (word.startsWith("http://") || word.startsWith("https://")) {
        return (
          <a
            key={index}
            href={word}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 cursor-pointer"
          >
            {word}{" "}
          </a>
        );
      } else {
        return <span key={index}>{word} </span>;
      }
    });

  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-10/12 md:w-full hover:bg-background/70 cursor-pointer z-30">
        <div className="flex flex-row items-center justify-center w-full gap-2 border-b-2">
          <Image
            onClick={() => router.push(`/user/${author.username}`)}
            src={
              author.image ||
              "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"
            }
            alt="author avatar"
            width={1000}
            height={1000}
            className="rounded-full self-start size-10"
          />
          <div className="flex flex-col w-full relative">
            <div className="flex flex-row w-full md:gap-64">
              <a
                href={`/user/${author.username}`}
                className="text-sm font-bold dark:text-white text-black"
              >
                {author.name}
                {author.verified && (
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
              </a>
              <div className="flex flex-row items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(new Date(createdAt))} ago
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative top-1">
                    <MoreHorizontal className="size-5 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {(author.id === session?.user.id ||
                      session?.user.role === "ADMIN") && (
                      <>
                        <DropdownMenuItem>
                          <Pencil className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete}>
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem>
                      <Flag className="size-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(
                          window.location.href + "threads/" + threadId
                        )
                      }
                    >
                      <Share className="size-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <span className="text-sm dark:text-white text-black w-72 md:w-80">
              {renderContent(content)}
            </span>
            {image && (
              <div className="w-full h-52">
                <AlertDialog>
                  <AlertDialogTrigger className="w-auto rounded-full">
                    <Image
                      src={image}
                      alt="post image preview"
                      width={1000}
                      height={1000}
                      className="w-80 h-52 object-cover rounded-xl"
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <Image
                      src={image}
                      alt="post image full size"
                      width={1000}
                      height={1000}
                      className="w-full"
                    />
                    <AlertDialogCancel>
                      <X />
                    </AlertDialogCancel>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            <div className="flex flex-row items-center gap-2 py-1">
              <Heart
                className={`size-5 ${
                  likes.some((like) => like.userId === session?.user.id)
                    ? "dark:text-[#ff0000]"
                    : "dark:text-white"
                }`}
                fill={
                  likes.some((like) => like.userId === session?.user.id)
                    ? "red"
                    : "none"
                }
                onClick={handleLike}
              />
              <span className="text-gray-500">‧</span>
              <MessageSquare className="size-5 dark:text-white" />
            </div>
            <div className="flex flex-row items-center gap-1 py-1">
              <span className="text-xs text-gray-500">
                {likes.length} like{likes.length > 1 ? "s" : ""}
              </span>
              <span className="text-gray-500">‧</span>
              <span className="text-xs text-gray-500">
                {comments.length} comment{comments.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md p-2.5 text-sm relative top-4">
            Write a comment
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center p-2 pb-3">
                Write a comment
              </DialogTitle>
              <div className="flex flex-col items-center space-y-4">
                <Label htmlFor="text" className="sr-only">
                  Message
                </Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  id="text"
                  placeholder="Write a comment"
                  className="w-80 h-20 rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <DialogClose asChild>
                  <Button
                    type="submit"
                    size="sm"
                    onClick={handleComment}
                    className="px-3 dark:text-black text-white"
                  >
                    Comment
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="relative top-10 w-full">
          {comments.map(({ id, author, content, createdAt, likes }) => (
            <div key={id} className="flex flex-col items-start gap-2">
              <div className="flex flex-row items-center gap-2">
                <Image
                  onClick={() => router.push(`/user/${author.username}`)}
                  src={
                    author.image ||
                    "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"
                  }
                  alt="author avatar"
                  width={1000}
                  height={1000}
                  className="rounded-full size-10"
                />
                <div className="flex flex-col w-full">
                  <div className="flex flex-row w-full gap-32">
                    <span
                      onClick={() => router.push(`/user/${author.username}`)}
                      className="text-sm font-bold dark:text-white text-black truncate"
                    >
                      {author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(createdAt)} ago
                    </span>
                  </div>
                  <span className="text-sm dark:text-white text-black pb-4 py-2 w-56">
                    {renderContent(content)}
                  </span>
                  <div className="flex flex-row items-center gap-2 py-2">
                    <Heart
                      className={`size-5 ${
                        likes.some((like) => like.userId === session?.user.id)
                          ? "dark:text-[#ff0000]"
                          : "dark:text-white"
                      }`}
                      fill={
                        likes.some((like) => like.userId === session?.user.id)
                          ? "red"
                          : "none"
                      }
                      onClick={() => handleCommentLike(id)}
                    />
                    <span className="text-gray-500">‧</span>
                    <MessageSquare
                      className="size-5 dark:text-white"
                      onClick={() => router.push(`/threads/${id}`)}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-1 py-2">
                    <span className="text-xs text-gray-500">
                      {likes.length} like{likes.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

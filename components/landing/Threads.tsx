"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PrismaTypes from "@prisma/client";
import {
  BadgeCheck,
  Flag,
  Heart,
  LoaderCircle,
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
import { useEffect, useState } from "react";
import { deleteThread } from "../action/deleteThread.action";
import { like } from "../action/like.action";
import { notification } from "../action/notification.action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ThreadWithAuthor = PrismaTypes.Thread & {
  author: PrismaTypes.User;
  likes: PrismaTypes.Like[];
};

type ThreadWithAuthorAndComments = ThreadWithAuthor & {
  comments: PrismaTypes.Comment[];
};

type ThreadsProps = {
  threads: ThreadWithAuthorAndComments[];
  session: Session | null;
  loading?: boolean;
};

export const Threads = ({ threads, session, loading }: ThreadsProps) => {
  const router = useRouter();
  const [threadsUpdated, setThreadsUpdated] = useState(threads);
  const [isAnimating, setIsAnimating] = useState({
    status: false,
    threadId: "",
  });

  useEffect(() => {
    setThreadsUpdated(threads);
  }, [threads]);

  const handleDelete = async (threadId: string) => {
    if (!session) return;
    setThreadsUpdated((prevThreads) =>
      prevThreads.filter((thread) => thread.id !== threadId)
    );
    await deleteThread(threadId);
  };

  const handleLike = async (threadId: string, userId: string) => {
    if (!session) return;

    setIsAnimating({ status: true, threadId });

    setThreadsUpdated((prevThreads) =>
      prevThreads.map((thread) => updateThreadLikes(thread, threadId))
    );

    setTimeout(() => {
      setIsAnimating({ status: false, threadId });
    }, 250);

    const likeState = await like(session.user.id as string, threadId);
    if (likeState) {
      await notification(session.user.id as string, userId, "like", threadId);
    }
  };

  const updateThreadLikes = (
    thread: ThreadWithAuthorAndComments,
    threadId: string
  ) => {
    if (!session?.user.id) return thread;

    return thread.id === threadId
      ? {
          ...thread,
          likes: thread.likes.some((like) => like.userId === session.user.id)
            ? thread.likes.filter((like) => like.userId !== session.user.id)
            : [
                ...thread.likes,
                {
                  id: "temp-id",
                  threadId: thread.id,
                  userId: session.user.id,
                  createdAt: new Date(),
                },
              ],
        }
      : thread;
  };

  const handleUserClick = (username: string | null) => {
    if (!username) return;
    router.push(`/user/${username}`);
  };

  const handleThreadClick = (threadId: string) => {
    router.push(`/threads/${threadId}`);
  };

  const handleShareClick = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.href}threads/${postId}`);
  };

  return (
    <main
      className={`flex flex-col items-center justify-center md:w-full h-full first:pt-2 ${
        loading ? "last:pb-24" : "last:pb-11"
      }`}
    >
      {threadsUpdated.map((post) => (
        <ThreadCard
          key={post.id}
          post={post}
          session={session}
          isAnimating={isAnimating}
          onDelete={handleDelete}
          onLike={handleLike}
          onUserClick={handleUserClick}
          onThreadClick={handleThreadClick}
          onShareClick={handleShareClick}
        />
      ))}
      {loading && (
        <div className="flex flex-row items-center justify-center w-full h-10">
          <span className="text-sm dark:text-white text-black">
            <LoaderCircle className="size-6 animate-spin" />
          </span>
        </div>
      )}
    </main>
  );
};

type ThreadCardProps = {
  post: ThreadWithAuthorAndComments;
  session: Session | null;
  isAnimating: { status: boolean; threadId: string };
  onDelete: (threadId: string) => void;
  onLike: (threadId: string, userId: string) => void;
  onUserClick: (username: string | null) => void;
  onThreadClick: (threadId: string) => void;
  onShareClick: (postId: string) => void;
};

const ThreadCard = ({
  post,
  session,
  isAnimating,
  onDelete,
  onLike,
  onUserClick,
  onThreadClick,
  onShareClick,
}: ThreadCardProps) => (
  <div
    key={post.id}
    className="flex flex-col items-center justify-center w-full hover:bg-background/70 cursor-pointer z-30 p-1"
  >
    <div className="flex flex-row items-center justify-center w-full gap-2 border-b-2">
      <Image
        onClick={() => onUserClick(post.author.username)}
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
        <div className="flex flex-row w-full gap-40 md:gap-64">
          <span
            onClick={() => onUserClick(post.author.username)}
            className="text-sm font-bold dark:text-white text-black relative w-auto"
          >
            {post.author.name}
            {post.author.verified && (
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
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative top-1">
              <MoreHorizontal className="size-5 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {post.authorId === session?.user.id ||
              session?.user.role === "ADMIN" ? (
                <>
                  <DropdownMenuItem>
                    <Pencil className="size-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(post.id)}>
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuItem>
                <Flag className="size-4 mr-2" />
                Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShareClick(post.id)}>
                <Share className="size-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span
          onClick={() => onThreadClick(post.id)}
          className="text-sm dark:text-white text-black w-72 pb-1 md:w-80 overflow-hidden whitespace-normal break-words z-40"
        >
          {post.content
            .split(/\s+/)
            .map((word, index) =>
              parseContent(word, index, onUserClick, onThreadClick)
            )}
        </span>
        {post.image && (
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
        )}
        <div className="flex flex-row items-center justify-start gap-2 pt-0.5 w-full">
          <Heart
            onClick={() => onLike(post.id, post.authorId)}
            className={`size-5 transition-transform duration-300 ${
              isAnimating.threadId === post.id && isAnimating.status
                ? "scale-125"
                : "scale-100"
            } ${
              post.likes.find((like) => like.userId === session?.user.id)
                ? "text-[#ff0000]"
                : "dark:text-white"
            }`}
            fill={
              post.likes.find((like) => like.userId === session?.user.id)
                ? "red"
                : "none"
            }
          />
          <span className="text-gray-500">‧</span>
          <MessageSquare
            className="size-5 dark:text-white relative top-[0.5px]"
            onClick={() => onThreadClick(post.id)}
          />
        </div>
        <div className="flex flex-row items-center justify-start gap-1 pt-0.5 pb-3 w-full">
          <span className="text-xs text-gray-500 relative top-px">
            {post.likes.length} like{post.likes.length > 1 ? "s" : ""}
          </span>
          <span className="text-gray-500 relative top-1">‧</span>
          <span className="text-xs text-gray-500 relative top-px">
            {post.comments.length} comment{post.comments.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const parseContent = (
  word: string,
  index: number,
  onUserClick: (username: string) => void,
  onThreadClick: (threadId: string) => void
) => {
  if (word.startsWith("#")) {
    return (
      <span
        key={index}
        className="text-blue-500 cursor-pointer z-50"
        onClick={(e) => {
          e.stopPropagation();
          onThreadClick(word.slice(1));
        }}
      >
        {word}{" "}
      </span>
    );
  } else if (word.startsWith("@")) {
    return (
      <span
        key={index}
        className="text-blue-500 cursor-pointer z-50"
        onClick={(e) => {
          e.stopPropagation();
          onUserClick(word.slice(1));
        }}
      >
        {word}{" "}
      </span>
    );
  } else if (word.startsWith("https://") || word.startsWith("http://")) {
    return (
      <a
        key={index}
        href={word}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 cursor-pointer z-50"
      >
        {word}{" "}
      </a>
    );
  } else {
    return <span key={index}>{word} </span>;
  }
};

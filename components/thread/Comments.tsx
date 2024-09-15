import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Comment, CommentLike, User } from "@prisma/client";
import { Heart, MessageSquare } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CommentWithAuthorAndLikes = Comment & {
  author: User;
  likes: CommentLike[];
};

export default function Comments({
  commentData,
  session,
  renderContent,
  handleCommentLike,
}: {
  commentData: CommentWithAuthorAndLikes;
  session: Session;
  renderContent: (content: string) => JSX.Element[];
  handleCommentLike: (id: string) => void;
}) {
  const { id, author, content, createdAt, likes } = commentData;
  const [dynamicLikes, setDynamicLikes] = useState<CommentLike[]>(likes);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState({
    status: false,
    commentId: "",
  });
  return (
    <div key={id} className="flex flex-col items-start border-b p-2">
      <div className="flex flex-row items-start gap-2">
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
          <div className="flex flex-row w-full gap-40">
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
          <span className="text-sm dark:text-white text-black py-1 w-56">
            {renderContent(content)}
          </span>
          <div className="flex flex-row items-center gap-2 py-1">
            <Heart
              onClick={() => {
                setIsAnimating({ status: true, commentId: id });
                setDynamicLikes((prev) => {
                  if (prev.find((like) => like.userId === session?.user.id)) {
                    return prev.filter(
                      (like) => like.userId !== session?.user.id
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        id: "new_id",
                        commentId: id,
                        userId: session?.user.id,
                        createdAt: new Date(),
                      },
                    ];
                  }
                });
                setTimeout(() => {
                  setIsAnimating({ status: false, commentId: id });
                }, 250);
                handleCommentLike(id);
              }}
              className={`size-5 transition-transform duration-300 ${
                isAnimating.commentId === id && isAnimating.status
                  ? "scale-125"
                  : "scale-100"
              } ${
                dynamicLikes.find((like) => like.userId === session?.user.id)
                  ? "text-[#ff0000]"
                  : "dark:text-white"
              }`}
              fill={
                dynamicLikes.find((like) => like.userId === session?.user.id)
                  ? "red"
                  : "none"
              }
            />
            <span className="text-gray-500">‧</span>
            <MessageSquare
              className="size-5 dark:text-white"
              onClick={() => router.push(`/threads/${id}`)}
            />
          </div>
          <div className="flex flex-row items-center gap-1 py-1">
            <span className="text-xs text-gray-500">
              {dynamicLikes.length} like{dynamicLikes.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { Icons } from "@/lib/assets/icons";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import PrismaTypes from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type PostWithAuthor = PrismaTypes.Post & {
  author: PrismaTypes.User;
};

export const Post = ({ posts }: { posts: PostWithAuthor[] }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-8 px-16 z-40 pt-8 mb-12">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col items-center justify-center w-full hover:bg-background/70 px-4"
          onClick={() => router.push(`/post/${post.id}`)}
        >
          <div className="flex flex-col items-start justify-center w-full h-full">
            <div className="flex flex-row items-center justify-center gap-2 pb-1 relative right-10">
              <Image
                src={
                  "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"
                }
                alt="author avatar"
                width={20}
                height={20}
                className="rounded-full size-8"
              />
              <span className="text-sm font-bold dark:text-white text-black truncate relative bottom-2">
                {post.author.name}
              </span>
              <span className="text-xs text-gray-500 truncate relative right-px bottom-2">
                {formatRelativeTime(post.createdAt)} ago
              </span>
              <Icons.more className="size-5 relative left-48 text-gray-500 bottom-2" />
            </div>
            <span className="text-sm dark:text-white text-black pb-1 w-80 relative bottom-4">
              {post.content}
            </span>
          </div>
          <div className="w-full h-52 relative">
            <img
              src={
                post.image ||
                "https://d3rqy6w6tyyf68.cloudfront.net/AcuCustom/Sitename/DAM/135/scw-126-a-deep-dive-into-a-goalkeepers-roles-1.png"
              }
              alt="post image"
              className="w-full h-full object-cover rounded-lg relative bottom-2"
            />
          </div>

          <div
            className="w-full border-b relative py-2"
            style={{ width: `calc(100% + 10rem)` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

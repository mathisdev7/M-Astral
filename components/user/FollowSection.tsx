"use client";
import { Follow, User } from "@prisma/client";

import { Flag, UserRoundMinus, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { follow } from "../action/follow.action";
import { notification } from "../action/notification.action";
import { Button } from "../ui/button";

type UserWithFollowersAndFollowing = User & {
  followers: Follow[];
  following: Follow[];
};

export default function FollowSection({
  user,
  author,
}: {
  user: UserWithFollowersAndFollowing;
  author: User | null;
}) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState<boolean>(
    user.followers.some(
      (follower: Follow) => follower.followingId === author?.id
    )
      ? true
      : false
  );
  const [isFollowed, setIsFollowed] = useState<boolean>(
    user.following.some(
      (following: Follow) => following.followerId === author?.id
    )
      ? true
      : false
  );
  const handleFollow = async () => {
    if (!author) return;
    if (isFollowing) {
      setIsFollowing(!isFollowing);
    } else {
      if (isFollowed) {
        setIsFollowed(true);
      }
      setIsFollowing(!isFollowing);
    }
    const isAFollow = await follow(author?.id, user.id);
    if (isAFollow) {
      notification(author?.id as string, user?.id, "follow");
    }
    router.refresh();
  };
  return (
    <div className="flex flex-row justify-start items-center w-full relative top-8">
      {author?.id && user.id === author.id ? (
        <Button
          onClick={() => router.push("/profile/edit")}
          className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md px-2.5 py-0.5 text-sm dark: dark:hover:bg-none hover:bg-slate-400"
        >
          <UserRoundPlus size={16} className="mr-1" />
          Edit Profile
        </Button>
      ) : (
        <Button
          onClick={handleFollow}
          className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md px-2.5 py-0.5 text-sm dark:hover:bg-none hover:bg-slate-400"
        >
          {author?.id && isFollowing ? (
            <>
              <UserRoundMinus size={16} className="mr-1" />
              <span>Unfollow</span>
            </>
          ) : (
            <>
              <UserRoundPlus size={16} className="mr-1" />
              {author?.id && isFollowed ? (
                <span>Follow back</span>
              ) : (
                <span>Follow</span>
              )}
            </>
          )}
        </Button>
      )}
      <Button className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md px-2.5 py-0.5 text-sm ml-2 dark:hover:bg-none hover:bg-slate-400">
        <Flag size={16} className="mr-1" />
        Report
      </Button>
    </div>
  );
}

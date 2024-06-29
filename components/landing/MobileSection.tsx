"use client";
import { Icons } from "@/lib/assets/icons";
import { CircleX, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function MobileSection() {
  const session = useSession();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="lg:hidden block">
      {isNavOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
            }}
          ></div>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <a
              href="/"
              className="font-bold text-2xl py-2 rounded-xl flex flex-row justify-center items-center gap-2"
            >
              <Icons.home className="size-[1.5rem] dark:text-white text-black" />
              Home
            </a>
            <a
              href="/create"
              className="font-bold text-2xl py-2 rounded-xl flex flex-row justify-center items-center gap-2 text-white"
            >
              <Icons.plus className="size-[1.5rem]" />
              Create Post
            </a>
            <a
              href="/post/popular"
              className="font-bold text-2xl py-2 rounded-xl flex flex-row justify-center items-center gap-2 text-white"
            >
              <Icons.star className="size-[1.5rem]" />
              Popular Posts
            </a>
            <a
              href="/post/new"
              className="font-bold text-2xl py-2 rounded-xl flex flex-row justify-center items-center gap-2 text-white"
            >
              <Icons.zap className="size-[1.5rem]" />
              New Posts
            </a>
            {session?.data?.user && session?.data.user.role === "ADMIN" ? (
              <a
                href="/dashboard"
                className="font-bold text-2xl py-2 rounded-xl flex flex-row justify-center items-center gap-2 text-white"
              >
                <Lock className="size-[1.5rem]" />
                Dashboard
              </a>
            ) : null}
          </div>
          <div className="absolute top-2 left-3">
            <CircleX
              className="relative top-2 left-3 text-white"
              onClick={toggleNav}
            />
          </div>
        </div>
      )}

      <button
        onClick={toggleNav}
        className="flex flex-col space-y-1 justify-center items-center w-full h-full"
      >
        <div className="w-5 h-0.5 dark:bg-white bg-black"></div>
        <div className="w-5 h-0.5 dark:bg-white bg-black"></div>
        <div className="w-5 h-0.5 dark:bg-white bg-black"></div>
      </button>
    </div>
  );
}

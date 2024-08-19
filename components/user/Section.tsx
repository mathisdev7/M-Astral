"use client";

import { Threads } from "@/components/landing/Threads";
import PrismaTypes from "@prisma/client";
import { Session } from "next-auth";
import { Fragment, useState } from "react";

type ThreadWithAuthor = PrismaTypes.Thread & {
  author: PrismaTypes.User;
  likes: PrismaTypes.Like[];
};

type ThreadWithAuthorAndComments = ThreadWithAuthor & {
  comments: PrismaTypes.Comment[];
};

export default function Section({
  session,
  userThreads,
}: {
  session: Session | null;
  userThreads: ThreadWithAuthorAndComments[];
}) {
  const [choice, setChoice] = useState("threads");
  const threadsWithMedia = userThreads.filter((thread) => thread.image);
  return (
    <Fragment>
      <div className="flex flex-row justify-center items-center w-full relative top-7 p-1">
        <div className="border-t w-1/4"></div>
      </div>
      <div className="flex flex-row justify-center items-center w-full h-full relative top-10">
        <section className="flex flex-row justify-center items-start w-auto gap-4 text-xl">
          <span
            className={`${
              choice === "threads"
                ? "border-b-2 dark:border-white border-black"
                : "hover:scale-110 delay-100 cursor-pointer"
            } transition-transform delay-500`}
            onClick={() => setChoice("threads")}
          >
            Threads
          </span>
          <span
            className={`${
              choice === "reposts"
                ? "border-b-2 dark:border-white border-black"
                : "hover:scale-110 delay-100 cursor-pointer"
            } transition-transform delay-500`}
            onClick={() => setChoice("reposts")}
          >
            Reposts
          </span>
          <span
            className={`${
              choice === "media"
                ? "border-b-2 dark:border-white border-black"
                : "hover:scale-110 delay-100 cursor-pointer"
            } transition-transform delay-500`}
            onClick={() => setChoice("media")}
          >
            Media
          </span>
        </section>
      </div>
      {choice === "threads" && (
        <div className="flex justify-center items-center relative top-12">
          <Threads threads={userThreads} session={session} />
        </div>
      )}
      {choice === "media" && (
        <div className="flex justify-center items-center relative top-12">
          <Threads threads={threadsWithMedia} session={session} />
        </div>
      )}
      {choice === "reposts" && (
        <div className="flex justify-center items-center relative top-20">
          <span className="text-xl dark:text-white text-black">
            Nothing here :(
          </span>
        </div>
      )}
    </Fragment>
  );
}

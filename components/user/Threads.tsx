"use client";

import { Thread, User } from "@prisma/client";

export default function Threads({
  threads,
  choice,
  user,
}: {
  threads: Thread[];
  choice: string;
  user: User;
}) {
  return (
    <div>
      {choice === "threads" &&
        threads.map((thread) => (
          <div
            key={thread.id}
            className="flex flex-col justify-center items-center w-full h-full relative"
          >
            <div className="flex flex-row justify-center items-center w-full h-full relative">
              <div className="flex flex-row justify-center items-center w-full h-full relative">
                {thread.image ? (
                  <img
                    src={thread.image}
                    alt="thread image"
                    className="w-full h-full object-cover rounded-lg relative bottom-4"
                  />
                ) : null}
              </div>
              <div className="flex flex-row justify-center items-center w-full h-full relative">
                <div className="flex flex-row justify-center items-center w-full h-full relative">
                  <p className="text-sm dark:text-white text-black">
                    {thread.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

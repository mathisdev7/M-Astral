"use server";

import { Button } from "@/components/ui/button";
import Section from "@/components/user/Section";
import { prisma } from "@/lib/prisma";
import { Flag, UserRoundPlus } from "lucide-react";
import Image from "next/image";

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const usernameDecoded = decodeURIComponent(params.username);
  const user = await prisma.user.findUnique({
    where: {
      username: usernameDecoded,
    },
  });
  await prisma.$disconnect();
  if (!user) return null;
  return (
    <main className="w-full h-full">
      <div className="flex flex-row justify-center items-center w-full h-full p-4">
        <div className="h-full w-full flex justify-center items-center flex-row">
          <div className="flex justify-center items-center relative w-1/4">
            <section className="flex flex-col justify-center items-start w-full">
              <div className="flex flex-row justify-center items-center w-full">
                <section className="flex flex-col justify-center items-start w-full">
                  <h1 className="text-2xl dark:text-white text-black">
                    {user.name}
                  </h1>
                  <h1 className="text-[0.85rem] font-light text-[#777]">
                    {user.username}
                  </h1>
                </section>
                <Image
                  src={user?.image || "/default.png"}
                  alt="user profile picture"
                  width={200}
                  height={200}
                  className="rounded-full size-20"
                />
              </div>
              <p className="text-sm dark:text-white text-black relative top-2 w-60">
                {user.bio || "No biography"}
              </p>
              <p className="text-[0.9rem] text-[#777] relative top-5 w-60">
                4,333 followers • 1,333 following
              </p>
              <div className="flex flex-row justify-start items-center w-full relative top-8">
                <Button className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md px-2.5 py-0.5 text-sm">
                  <UserRoundPlus size={16} className="mr-1" />
                  Follow
                </Button>
                <Button className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md px-2.5 py-0.5 text-sm ml-2">
                  <Flag size={16} className="mr-1" />
                  Report
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Section />
    </main>
  );
}

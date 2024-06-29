"use server";
import { auth } from "@/auth/auth";
import { Icons } from "@/lib/assets/icons";
import { Lock } from "lucide-react";

export default async function Section() {
  const session = await auth();
  return (
    <nav className="list-none border-b-2 border-l-2 w-64 p-2 hidden lg:block">
      <h1 className="text-3xl font-bold text-center p-2">Categories</h1>
      <div className="border-b-2 w-full relative top-2"></div>
      <ul className="p-2 pt-4 text-center">
        <a
          href="/"
          className="font-light hover:bg-zinc-700 py-2 rounded-xl flex flex-row justify-center items-center gap-2"
        >
          <Icons.home className="size-[1.2rem]" />
          Home
        </a>
        <a
          href="/create"
          className="font-light hover:bg-zinc-700 py-2 rounded-xl flex flex-row justify-center items-center gap-2"
        >
          <Icons.plus className="size-[1.2rem]" />
          Create Post
        </a>
        <a
          href="/post/popular"
          className="font-light hover:bg-zinc-700 py-2 rounded-xl flex flex-row justify-center items-center gap-2"
        >
          <Icons.star className="size-[1.2rem]" />
          Popular Posts
        </a>
        <a
          href="/post/new"
          className="font-light hover:bg-zinc-700 py-2 rounded-xl flex flex-row justify-center items-center gap-2"
        >
          <Icons.zap className="size-[1.2rem]" />
          New Posts
        </a>
        {session?.user && session?.user.role === "ADMIN" ? (
          <a
            href="/dashboard"
            className="font-light hover:bg-zinc-700 py-2 rounded-xl flex flex-row justify-center items-center gap-2"
          >
            <Lock className="size-[1.2rem]" />
            Dashboard
          </a>
        ) : null}
      </ul>
    </nav>
  );
}

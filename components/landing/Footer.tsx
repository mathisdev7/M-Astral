"use server";
import { auth } from "@/auth/auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { prisma } from "@/lib/prisma";
import { Bell, Home, Search, SquarePen } from "lucide-react";
import ThreadForm from "../thread/ThreadForm";

export default async function Footer() {
  const session = await auth();
  if (!session) return null;
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id, viewed: false },
  });
  const notificationsLength = notifications.length;

  return (
    <footer className="fixed bottom-0 right-0 left-0 w-full justify-center items-center z-50 bg-background drop-shadow-2xl">
      <div className="flex h-full justify-center items-center">
        <div className="max-w-sm border-t p-2 flex relative flex-row space-x-4 justify-center items-center">
          <a href="/" className="flex relative flex-row space-x-4">
            <span className="text-2xl relative font-bold px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200">
              <Home size={15} />
            </span>
          </a>
          <a
            href="/search"
            className="flex relative flex-row space-x-4 px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200"
          >
            <span className="text-2xl relative font-bold">
              <Search size={15} />
            </span>
          </a>
          <span className="flex relative flex-row space-x-4 px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200">
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-2xl relative font-bold">
                  <SquarePen size={15} />
                </span>
              </DialogTrigger>
              <DialogContent className="w-5/6 md:w-full rounded-xl">
                <ThreadForm />
              </DialogContent>
            </Dialog>
          </span>
          <a
            href="/notifications"
            className="flex relative flex-row space-x-4 px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200"
          >
            <span className="text-2xl relative font-bold">
              {notificationsLength > 0 && (
                <div className="bg-[#ff0000] w-3 h-3 rounded-full flex items-center justify-center absolute bottom-1.5 right-2">
                  <span className="text-white text-[0.5rem] text-center relative right-[0.2px]">
                    {notificationsLength > 9 ? "9+" : notificationsLength}
                  </span>
                </div>
              )}
              <Bell size={15} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

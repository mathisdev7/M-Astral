"use client";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Notification, User } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type NotificationWithUserAndAuthor = Notification & {
  user: User;
  author: User;
};

export default function Landing({
  session,
  notifications,
}: {
  session: Session;
  notifications: NotificationWithUserAndAuthor[];
}) {
  if (notifications.length === 0) {
    return (
      <p className="text-center relative top-8 text-xl">
        You have no notifications.
      </p>
    );
  }
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-3 relative top-2 pb-12">
      {notifications.map((notification: NotificationWithUserAndAuthor) => (
        <div
          key={notification.id}
          className="border-2 p-4 rounded-xl gap-2 flex flex-col items-center justify-center w-72"
        >
          <div className="flex flex-row items-center justify-start gap-2 pt-0.5 w-full">
            <Image
              alt="notification user image"
              src={
                notification.author.image
                  ? notification.author.image
                  : "/default.png"
              }
              width={1000}
              height={1000}
              onClick={() => {
                router.push(`/user/${notification.author.username}`);
              }}
              className="rounded-full w-8 h-8 object-cover"
            />
            <p className="text-sm dark:text-white text-black">
              {notification.content.split(" ").map((word, index) => {
                if (word.startsWith("@")) {
                  return (
                    <span
                      key={index}
                      onClick={() => router.push(`/user/${word.slice(1)}`)}
                      className="font-bold text-blue-500 cursor-pointer"
                    >
                      {word}{" "}
                    </span>
                  );
                } else {
                  return <span key={index}>{word} </span>;
                }
              })}
            </p>
            <p className="text-xs text-gray-500 relative top-px">
              {formatRelativeTime(new Date(notification.createdAt))} ago
            </p>
          </div>
          {notification.image && (
            <div className="group relative w-full">
              <Image
                alt="notification image"
                src={notification.image}
                width={1000}
                height={1000}
                className="rounded-xl w-full h-56 group-hover:opacity-40 transition-opacity duration-300"
              ></Image>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="text-center">
                  <Button
                    onClick={() => {
                      router.push(`/threads/${notification.threadId}`);
                    }}
                    className="py-2 px-4 rounded bg-black hover:bg-black/90 transition-all duration-300"
                  >
                    View Post
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

"use server";
import { auth } from "@/auth/auth";
import Landing from "@/components/notifications/Landing";
import { prisma } from "@/lib/prisma";

export default async function Notifications() {
  const session = await auth();
  if (!session) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { user: true, author: true },
  });
  await prisma.notification.updateMany({
    where: { userId: session.user.id },
    data: { viewed: true },
  });

  return (
    <div>
      <Landing notifications={notifications} />
    </div>
  );
}

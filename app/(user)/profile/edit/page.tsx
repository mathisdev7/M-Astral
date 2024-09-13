"use server";

import { auth } from "@/auth/auth";
import EditForm from "@/components/profile/EditForm";
import { prisma } from "@/lib/prisma";

export default async function ProfileEdit() {
  const session = await auth();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      location: true,
      url: true,
      private: true,
      profileViews: true,
      verified: true,
      role: true,
      email: true,
      emailVerified: true,
    },
  });
  prisma.$disconnect();
  if (!user) return null;
  return (
    <main className="w-full h-full">
      <div className="flex flex-row justify-center items-center w-full h-full p-4">
        <EditForm user={user} session={session} />
      </div>
    </main>
  );
}

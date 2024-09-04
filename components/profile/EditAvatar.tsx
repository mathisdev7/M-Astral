"use client";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { User } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import ImageUpload from "../ui/image-upload";

export default function EditAvatar({
  session,
  user,
}: {
  session: any;
  user: {
    id: User["id"];
    name: User["name"];
    username: User["username"];
    image: User["image"];
    bio: User["bio"];
    location: User["location"];
    url: User["url"];
  };
}) {
  return (
    <div className="dark:bg-[#333]/40 bg-[#272829] w-auto h-16 rounded-xl flex flex-row justify-center items-center gap-10 px-8">
      <div className="flex flex-row justify-center items-center gap-2">
        <Image
          src={session.user.image}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full size-12 relative right-px"
        />
        <div className="flex flex-col justify-center items-center">
          <div className="text-white text-sm font-bold w-20">
            {session.user.name}
          </div>
          <div className="text-white text-xs truncate w-20">
            {session.user.username}
          </div>
        </div>
      </div>
      <Credenza>
        <CredenzaTrigger asChild>
          <Button className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md text-xs w-auto h-auto hover:bg-white">
            Change Avatar
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Upload Image</CredenzaTitle>
            <CredenzaDescription>
              Upload a new image to use as your avatar.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <ImageUpload userId={session.user.id} />
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose
              asChild
              className="flex justify-center items-center w-full"
            >
              <div>
                <Button className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md text-xs w-auto h-auto hover:bg-[#f0f0f0]">
                  Cancel
                </Button>
              </div>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

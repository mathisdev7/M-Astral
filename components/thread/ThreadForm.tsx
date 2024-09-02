"use client";
import { createThread } from "@/components/action/createThread.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { toast } from "sonner";

export default function ThreadForm() {
  const session = useSession();
  const router = useRouter();
  if (!session.data) {
    return (
      <div className="flex flex-row justify-center items-center w-full h-full">
        <div className="h-full w-full flex justify-center items-center flex-row">
          <h1 className="text-2xl font-bold dark:text-white text-black relative top-6">
            Please sign in to view this page.
          </h1>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const isContentEmpty = event.currentTarget.content.value;

      if (!isContentEmpty) {
        return toast.error("Content is required");
      }

      const imageFile = event.currentTarget.image.files[0];
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("upload_preset", "fthread-preset-name");
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/deflgbu3s/image/upload`,
          imageFormData
        );
        await createThread(
          session.data?.user.id as string,
          response.data.secure_url,
          isContentEmpty
        );
      } else {
        await createThread(
          session.data?.user.id as string,
          event.currentTarget.image.files[0],
          event.currentTarget.content.value
        );
      }
      toast.success("Thread created");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to create thread");
      console.error(error);
    }
  };
  return (
    <Fragment>
      <h1 className="text-2xl">Create a new thread</h1>

      <form
        onSubmit={async (event) => await handleSubmit(event)}
        className="w-full max-w-lg flex flex-col gap-4"
      >
        <Label htmlFor="content" className="relative top-2">
          Content
        </Label>
        <Textarea id="content" name="content" rows={5} />
        <Label htmlFor="image" className="relative top-2">
          Image
        </Label>
        <Input id="image" name="image" type="file" accept="image/*" />
        <Button type="submit" className="dark:text-black text-white">
          Create thread
        </Button>
      </form>
    </Fragment>
  );
}

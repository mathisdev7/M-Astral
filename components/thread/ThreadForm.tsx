"use client";
import { createThread } from "@/components/action/createThread.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import SignIn from "../errors/SignIn";

export default function ThreadForm() {
  const session = useSession();
  if (!session.data) {
    return <SignIn />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const isContentEmpty = event.currentTarget.content.value;

      if (!isContentEmpty) {
        return toast.error("Content is required");
      }

      const imageFiles = event.currentTarget.image.files;
      let imageUrls = [];

      if (imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          const imageFormData = new FormData();
          imageFormData.append("file", imageFile);
          imageFormData.append("upload_preset", "fthread-preset-name");
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/deflgbu3s/image/upload`,
            imageFormData
          );
          imageUrls.push(response.data.secure_url);
        }
      }

      await createThread(
        session.data?.user.id as string,
        imageUrls,
        isContentEmpty
      );

      toast.success("Thread created");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to create thread");
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-center">Create a new thread</h1>

      <form
        onSubmit={async (event) => await handleSubmit(event)}
        className="w-full max-w-lg flex flex-col gap-4"
      >
        <Label htmlFor="content" className="relative top-2">
          Content
        </Label>
        <Textarea id="content" name="content" rows={5} />
        <Label htmlFor="image" className="relative top-2">
          Images
        </Label>
        <Input id="image" name="image" type="file" accept="image/*" multiple />
        <Button type="submit" className="dark:text-black text-white">
          Create thread
        </Button>
      </form>
    </div>
  );
}

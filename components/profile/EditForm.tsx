"use client";
import { User } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { editUser } from "../action/editUser.action";
import { setPrivate } from "../action/private.action";
import { setProfileViews } from "../action/profileViews.action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import EditAvatar from "./EditAvatar";

type EditFormProps = {
  user: User;
  session: Session;
};

const validateUserData = (userData: any) => {
  const errors: string[] = [];
  const username = userData.username || "";
  const bio = userData.bio || "";
  const name = userData.name || "";
  const location = userData.location || "";
  const url = userData.url || "";

  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\w./-]*)?$/;

  if (username.includes("@")) errors.push("Username cannot contain @.");
  if (username.includes(" ")) errors.push("Username cannot contain spaces.");
  if (username.length < 2) errors.push("Username is too short.");
  if (username.length > 15) errors.push("Username is too long.");

  if (bio.length > 160) errors.push("Bio is too long.");

  if (name.length > 50) errors.push("Name is too long.");

  if (location.length > 30) errors.push("Location is too long.");

  if (url.length > 50) errors.push("URL is too long.");
  if (url && !urlRegex.test(url)) errors.push("Invalid URL.");

  return errors;
};

export default function EditForm({ user, session }: Readonly<EditFormProps>) {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: user.name,
    username: user.username as string,
    bio: user.bio,
    location: user.location,
    url: user.url,
    private: user.private,
    profileViews: user.profileViews,
  });
  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);
  const [isLoadingProfileViews, setIsLoadingProfileViews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const errors = validateUserData(userData);
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setUserData((prev) => ({
      ...prev,
      username: prev.username.toLowerCase(),
    }));

    setIsLoading(true);
    try {
      await editUser(user.id, userData);
      toast.success("Profile updated.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoadingPrivate(true);
    await setPrivate(user.id);
    toast.success("Private account updated.");
    setUserData((prev) => ({ ...prev, private: !prev.private }));
    setIsLoadingPrivate(false);
  };

  const handleProfileViews = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoadingProfileViews(true);
    await setProfileViews(user.id);
    toast.success("Profile views updated.");
    setUserData((prev) => ({ ...prev, profileViews: !prev.profileViews }));
    setIsLoadingProfileViews(false);
  };

  return (
    <form className="h-full w-full flex justify-center items-center flex-col gap-3">
      <EditAvatar session={session} />
      <div className="dark:bg-[#333]/40 bg-[#272829] w-auto h-auto rounded-xl flex flex-col justify-center items-center gap-2 px-24 py-3">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Label htmlFor="private" className="font-bold text-white">
            Private account
          </Label>
          {!isLoadingPrivate ? (
            <Switch
              onClick={handlePrivate}
              id="private"
              name="private"
              checked={userData.private}
            />
          ) : (
            <LoaderCircle className="w-6 h-6 animate-spin" />
          )}
        </div>
        <div className="w-1/2 border border-[#272829] px-20" />
        <div className="flex flex-row gap-2 justify-center items-center">
          <Label htmlFor="profileViews" className="font-bold text-white">
            Profile views
          </Label>
          {!isLoadingProfileViews ? (
            <Switch
              onClick={handleProfileViews}
              id="profileViews"
              name="profileViews"
              className="relative left-[0.60rem]"
              checked={userData.profileViews}
            />
          ) : (
            <LoaderCircle className="w-6 h-6 animate-spin" />
          )}
        </div>
      </div>
      <div className="w-full h-auto flex flex-col justify-center items-center gap-6">
        <div className="dark:bg-[#333]/40 bg-[#272829] w-auto h-auto rounded-xl flex flex-col gap-5 px-11 py-4">
          <h1 className="self-center text-2xl font-bold text-white">
            Edit Profile
          </h1>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="bio" className="font-bold text-white">
              Biography
            </Label>
            <Textarea
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, bio: e.target.value }))
              }
              id="bio"
              name="bio"
              placeholder={user.bio ?? "Bio"}
              className="w-64 h-16"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="name" className="font-bold text-white">
              Name
            </Label>
            <Input
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              id="name"
              type="text"
              name="name"
              placeholder={user.name || "Name"}
              className="w-64 font-bold"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="username" className="font-bold text-white">
              Username
            </Label>
            <Input
              type="text"
              name="username"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  username: e.target.value.toLowerCase(),
                }))
              }
              value={userData.username as string}
              placeholder={user.username || "Username"}
              id="username"
              className="w-64 font-bold"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="location" className="font-bold text-white">
              Location
            </Label>
            <Input
              type="text"
              name="location"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder={user.location || "Location"}
              id="location"
              className="w-64 font-bold"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="url" className="font-bold text-white">
              URL
            </Label>
            <Input
              type="text"
              name="url"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder={user.url || "URL"}
              id="url"
              className="w-64 font-bold"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md w-auto h-auto p-2 text-sm hover:bg-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

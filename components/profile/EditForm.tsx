"use client";
import { User } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
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

export default function EditForm({
  user,
  session,
}: {
  user: {
    id: User["id"];
    name: User["name"];
    username: User["username"];
    image: User["image"];
    bio: User["bio"];
    location: User["location"];
    url: User["url"];
    private: User["private"];
    verified: User["verified"];
    profileViews: User["profileViews"];
  };
  session: any;
}) {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    location: user.location,
    url: user.url,
    private: user.private,
    profileViews: user.profileViews,
  });
  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);
  const [isLoadingProfileViews, setIsLoadingProfileViews] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (
        userData.username &&
        userData.username.slice(1, userData.username.length).includes("@")
      ) {
        return toast.error("Username cannot contain @.");
      }
      if (userData.username && userData.username.includes(" ")) {
        return toast.error("Username cannot contain spaces.");
      }
      if (userData.username && userData.username.length < 2) {
        return toast.error("Username is too short.");
      }
      if (userData.username && userData.username.length > 15) {
        return toast.error("Username is too long.");
      }
      if (userData.username) {
        setUserData({ ...userData, username: userData.username.toLowerCase() });
      }
      if (userData.bio && userData.bio.length > 160) {
        return toast.error("Bio is too long.");
      }
      if (userData.name && userData.name.length > 50) {
        return toast.error("Name is too long.");
      }
      if (userData.location && userData.location.length > 30) {
        return toast.error("Location is too long.");
      }
      if (userData.url && userData.url.length > 50) {
        return toast.error("URL is too long.");
      }
      const urlRegex = new RegExp(
        "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$"
      );
      if (userData.url && !urlRegex.test(userData.url)) {
        return toast.error("Invalid URL.");
      }
      await editUser(user.id, userData);
      toast.success("Profile updated.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }
  };
  const handlePrivate = async (e: any) => {
    e.preventDefault();
    setIsLoadingPrivate(true);
    await setPrivate(user.id);
    toast.success("Private account updated.");
    setUserData({ ...userData, private: !userData.private });
    setIsLoadingPrivate(false);
  };
  const handleProfileViews = async (e: any) => {
    e.preventDefault();
    setIsLoadingProfileViews(true);
    await setProfileViews(user.id);
    toast.success("Profile views updated.");
    setUserData({ ...userData, profileViews: !userData.profileViews });
    setIsLoadingProfileViews(false);
  };
  return (
    <form className="h-full w-full flex justify-center items-center flex-col gap-3">
      <EditAvatar session={session} user={user} />
      <div className="dark:bg-[#333]/40 bg-[#272829] w-auto h-auto rounded-xl flex flex-col justify-center items-center gap-2 px-24 py-3">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Label htmlFor="prvate" className="font-bold text-white">
            Private account
          </Label>
          {!isLoadingPrivate ? (
            <Switch
              onClick={(e) => handlePrivate(e)}
              id="private"
              name="private"
              checked={userData.private}
            />
          ) : (
            <LoaderCircle className="w-6 h-6 animate-spin " />
          )}
        </div>
        <div className="w-1/2 border border-[#272829] px-20" />
        <div className="flex flex-row gap-2 justify-center items-center">
          <Label htmlFor="profileViews" className="font-bold text-white">
            Profile views
          </Label>
          {!isLoadingProfileViews ? (
            <Switch
              onClick={(e) => handleProfileViews(e)}
              id="profileViews"
              name="profileViews"
              className="relative left-[0.60rem]"
              checked={userData.profileViews}
            />
          ) : (
            <LoaderCircle className="w-6 h-6 animate-spin " />
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
                setUserData({ ...userData, bio: e.target.value })
              }
              id="bio"
              name="bio"
              placeholder={user.bio || "Bio"}
              className="w-64 h-16"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="name" className="font-bold text-white">
              Name
            </Label>
            <Input
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
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
                setUserData({
                  ...userData,
                  username: e.target.value.padStart(1, "@").toLowerCase(),
                })
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
                setUserData({
                  ...userData,
                  location: e.target.value,
                })
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
                setUserData({ ...userData, url: e.target.value })
              }
              placeholder={user.url || "URL"}
              id="url"
              className="w-64 font-bold"
            />
          </div>
          <Button
            onClick={(e) => handleSubmit(e)}
            className="dark:bg-[#333] bg-[#f0f0f0] dark:text-white text-black rounded-md w-auto h-auto p-2 text-sm hover:bg-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

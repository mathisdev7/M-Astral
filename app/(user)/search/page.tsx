"use client";

import { search as searchAction } from "@/components/action/search.action";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<User[] | null>([]);
  const handleSearch = async (search: string) => {
    if (!search) {
      setSearchResults(null);
      return;
    }
    const results = await searchAction(search);
    setSearchResults(results);
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-2">
      <h1 className="text-2xl">Search for an user</h1>
      <Input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        className="w-64 p-2 rounded-md border border-gray-300 dark:bg-[#333] dark:text-white"
        placeholder="Search"
      />
      {searchResults && searchResults.length > 0
        ? searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => router.push(`/user/${user.username}`)}
              className="flex flex-row items-center justify-center space-x-2 w-full cursor-pointer"
            >
              <Image
                src={user.image || "/default.png"}
                alt="user profile picture"
                className="w-10 h-10 rounded-full"
                width={100}
                height={100}
                onClick={() => router.push(`/user/${user.username}`)}
              />
              <div className="flex flex-col items-start space-y-px relative top-px">
                <div className="flex flex-row items-center justify-start space-x-1">
                  <p>{user.name}</p>
                  {user.verified ? (
                    <BadgeCheck className="inline-block size-4 text-blue-500" />
                  ) : null}
                </div>
                <p className="text-[0.85rem] text-[#777] relative bottom-1">
                  {user.username}
                </p>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}

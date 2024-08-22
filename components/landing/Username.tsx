"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { changeUsername } from "../action/changeUsername.action";
import { Button } from "../ui/button";

export default function Username({ userId }: { userId: string }) {
  const [username, setUsername] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {" "}
      <label className="text-2xl font-bold dark:text-white text-black p-5">
        Choose an username to start posting
      </label>
      <input
        type="text"
        id="username"
        value={username.padStart(1, "@")}
        className="border rounded-md w-40 p-1"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        className=" dark:text-black text-white font-bold py-2 px-4 rounded mt-2"
        onClick={async () => {
          try {
            if (username.length > 15) {
              return toast.error("Username is too long.");
            }
            if (username.length < 2) {
              return toast.error("Username is too short.");
            }
            if (username.includes(" ")) {
              return toast.error("Username cannot contain spaces.");
            }
            if (username.slice(1, username.length).includes("@")) {
              return toast.error("Username cannot contain @.");
            }
            await changeUsername(username.toLowerCase(), userId);
            router.refresh();
          } catch (error) {
            toast.error("Username already exists.");
          }
        }}
      >
        Get Started
      </Button>
    </div>
  );
}

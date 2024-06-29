"use client";
import { LogOut, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOutAction } from "../action/signOut.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type LoggedInDropdownProps = {
  children: React.ReactNode;
};

export default function LoggedInDropdown({ children }: LoggedInDropdownProps) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col items-center justify-center">
        <form>
          <DropdownMenuItem
            onClick={() => {
              signOutAction();
            }}
            className="bg-transparent hover:border-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/profile/edit");
            }}
            className="bg-transparent hover:border-transparent"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

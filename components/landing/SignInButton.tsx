import { signIn } from "@/auth/auth";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const SignInButton = () => {
  return (
    <form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="relative border-transparent"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Log in
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col items-center justify-center">
          <form>
            <DropdownMenuItem className="bg-transparent hover:bg-transparent flex flex-col space-y-2">
              <Button
                variant="secondary"
                size="sm"
                formAction={async () => {
                  "use server";
                  await signIn("google");
                }}
                className="relative border-transparent"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login with google
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-transparent hover:bg-transparent flex flex-col space-y-2">
              <Button
                variant="secondary"
                size="sm"
                formAction={async () => {
                  "use server";
                  await signIn("github");
                }}
                className="relative border-transparent"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login with github
              </Button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
};

export default SignInButton;

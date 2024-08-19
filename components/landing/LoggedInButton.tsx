import { auth } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import LoggedInDropdown from "./LoggedInDropdown";
import SignInButton from "./SignInButton";

const LoggedInButton = async () => {
  const session = await auth();

  if (!session) {
    return <SignInButton />;
  }

  if (session && session.user?.name) {
    return (
      <LoggedInDropdown session={session}>
        <Button
          size="sm"
          variant="default"
          className="relative border-transparent bg-transparent hover:bg-transparent dark:text-[#fff] "
        >
          <Avatar className="size-8">
            <AvatarFallback>
              {session?.user.name[0]?.toUpperCase()}
            </AvatarFallback>
            {session.user.image ? (
              <AvatarImage
                width={50}
                height={50}
                src={session.user.image}
                alt={session.user.name}
              />
            ) : null}
          </Avatar>
        </Button>
      </LoggedInDropdown>
    );
  }
};

export default LoggedInButton;

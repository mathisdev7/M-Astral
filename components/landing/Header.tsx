import { ToggleMode } from "@/components/ui/toggleMode";
import LoggedInButton from "./LoggedInButton";
import Logo from "./Logo";
import MobileSection from "./MobileSection";

export default function Header() {
  return (
    <header className="border-b border-t-gray-800 p-1.5">
      <div className="flex gap-4 w-full h-full justify-center items-center">
        <div className="flex relative flex-row space-x-4 right-20">
          <Logo />
        </div>
        <MobileSection />

        <div className="relative top-px left-24">
          <LoggedInButton />
        </div>
        <ToggleMode />
      </div>
    </header>
  );
}

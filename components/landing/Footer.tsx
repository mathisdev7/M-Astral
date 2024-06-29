import { Home, Search, SquarePen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 right-0 left-0 w-full justify-center items-center z-50 bg-background">
      <div className="flex h-full justify-center items-center">
        <div className="max-w-sm border-t p-2 flex relative flex-row space-x-4">
          <div className="flex relative flex-row space-x-4">
            <span className="text-2xl relative font-bold px-12 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200">
              <Home size={20} />
            </span>
          </div>
          <div className="flex relative flex-row space-x-4 px-12 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200">
            <span className="text-2xl relative font-bold">
              <Search size={20} />
            </span>
          </div>
          <div className="flex relative flex-row space-x-4 px-12 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200">
            <span className="text-2xl relative font-bold">
              <SquarePen size={20} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

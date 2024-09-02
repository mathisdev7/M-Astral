import { Bell, Home, Search, SquarePen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 right-0 left-0 w-full justify-center items-center z-50 bg-background drop-shadow-2xl">
      <div className="flex h-full justify-center items-center">
        <div className="max-w-sm border-t p-2 flex relative flex-row space-x-4 justify-center items-center">
          <a href="/" className="flex relative flex-row space-x-4">
            <span className="text-2xl relative font-bold px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200">
              <Home size={15} />
            </span>
          </a>
          <a
            href="/search"
            className="flex relative flex-row space-x-4 px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200"
          >
            <span className="text-2xl relative font-bold">
              <Search size={15} />
            </span>
          </a>
          <a
            href="/threads/create"
            className="flex relative flex-row space-x-4 px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200"
          >
            <span className="text-2xl relative font-bold">
              <SquarePen size={15} />
            </span>
          </a>
          <a
            href="/notifications"
            className="flex relative flex-row space-x-4 px-8 md:px-10 p-2 border rounded-xl dark:hover:bg-[#333] hover:bg-gray-200"
          >
            <span className="text-2xl relative font-bold">
              <Bell size={15} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

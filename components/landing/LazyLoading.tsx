"use client";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useThreads } from "./ThreadContext";
import { Threads } from "./Threads";

export const HomePage = ({ session }: { session: Session }) => {
  const { threads, loadMoreThreads, hasMore, loading } = useThreads();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 1500 &&
        hasMore &&
        !loading
      ) {
        loadMoreThreads();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreThreads, hasMore, loading]);

  return <Threads threads={threads} session={session} loading={loading} />;
};

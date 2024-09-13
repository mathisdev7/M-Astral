"use client";
import PrismaTypes from "@prisma/client";
import { Session } from "next-auth";
import { createContext, useContext, useMemo, useState } from "react";

type ThreadWithAuthor = PrismaTypes.Thread & {
  author: PrismaTypes.User;
  likes: PrismaTypes.Like[];
};

type ThreadWithAuthorAndComments = ThreadWithAuthor & {
  comments: PrismaTypes.Comment[];
};

type ThreadContextType = {
  threads: ThreadWithAuthorAndComments[];
  loadMoreThreads: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
};

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export const useThreads = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
};

export const ThreadProvider = ({
  children,
  initialThreads,
  session,
}: {
  children: React.ReactNode;
  initialThreads: ThreadWithAuthorAndComments[];
  session: Session | null;
}) => {
  const [threads, setThreads] = useState(initialThreads);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreThreads = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const cachedThreadsJSON = localStorage.getItem(`threads-page-${nextPage}`);
    let cachedThreads = null;
    if (cachedThreadsJSON) {
      cachedThreads = JSON.parse(cachedThreadsJSON);
    }
    if (cachedThreads && cachedThreads.length > 0) {
      setThreads((prevThreads) => [...prevThreads, ...cachedThreads]);
      setPage(nextPage);
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/threads?page=${nextPage}`);
    const data = await res.json();
    if (data.length > 0) {
      setThreads((prevThreads) => [...prevThreads, ...data]);
      setPage(nextPage);
      localStorage.setItem(`threads-page-${nextPage}`, JSON.stringify(data));
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  const contextValue = useMemo(
    () => ({
      threads,
      loadMoreThreads,
      hasMore,
      loading,
    }),
    [threads, loadMoreThreads, hasMore, loading]
  );

  return (
    <ThreadContext.Provider value={contextValue}>
      {children}
    </ThreadContext.Provider>
  );
};

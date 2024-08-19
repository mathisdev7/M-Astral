"use server";
import ThreadForm from "@/components/thread/ThreadForm";

export default async function ThreadCreate() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ThreadForm />
    </div>
  );
}

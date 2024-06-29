"use client";

import { Fragment, useState } from "react";

export default function Section() {
  const [choice, setChoice] = useState("threads");
  return (
    <Fragment>
      <div className="flex flex-row justify-center items-center w-full relative top-7 p-1">
        <div className="border-t w-1/4"></div>
      </div>
      <div className="flex flex-row justify-center items-center w-full h-full relative top-10">
        <section className="flex flex-row justify-center items-start w-auto gap-4 text-xl">
          <span
            className={`${
              choice === "threads"
                ? "border-b-2 dark:border-white border-black"
                : "hover:scale-110 delay-100 cursor-pointer"
            } transition-transform delay-500`}
            onClick={() => setChoice("threads")}
          >
            Threads
          </span>
          <span
            className={`${
              choice === "reposts"
                ? "border-b-2 dark:border-white border-black"
                : "hover:scale-110 delay-100 cursor-pointer"
            } transition-transform delay-500`}
            onClick={() => setChoice("reposts")}
          >
            Reposts
          </span>
          <span
            className={`${
              choice === "media"
                ? "border-b-2 dark:border-white border-black"
                : "hover:scale-110 delay-100 cursor-pointer"
            } transition-transform delay-500`}
            onClick={() => setChoice("media")}
          >
            Media
          </span>
        </section>
      </div>
    </Fragment>
  );
}

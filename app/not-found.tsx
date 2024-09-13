"use client";

export default function ErrorPage() {
  const reset = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>Something went wrong!</p>
        <button
          onClick={() => reset()}
          className=" dark:text-black dark:bg-[#fff] bg-[#000] font-bold py-2 px-4 rounded relative top-4"
        >
          Try again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className=" dark:text-white font-bold py-2 px-4 rounded relative top-8"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

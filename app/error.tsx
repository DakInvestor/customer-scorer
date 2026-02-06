"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Something went wrong</h1>
        <p className="mb-6 text-gray-400">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-md bg-white px-6 py-2.5 font-semibold text-gray-900 hover:bg-gray-100"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="rounded-md bg-gray-700 px-6 py-2.5 font-semibold hover:bg-gray-600"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
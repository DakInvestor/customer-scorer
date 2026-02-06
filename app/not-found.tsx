// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">Page not found</h2>
        <p className="mb-6 text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-white px-6 py-2.5 font-semibold text-gray-900 hover:bg-gray-100"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
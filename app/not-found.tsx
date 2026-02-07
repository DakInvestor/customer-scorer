// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-charcoal">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-charcoal">Page not found</h2>
        <p className="mb-6 text-text-secondary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-charcoal px-6 py-2.5 font-semibold text-white hover:bg-charcoal/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
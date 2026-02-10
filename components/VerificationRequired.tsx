import Link from "next/link";

interface VerificationRequiredProps {
  feature: string;
}

export default function VerificationRequired({ feature }: VerificationRequiredProps) {
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber/20">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="text-xl font-bold text-charcoal">Verification Required</h2>
        <p className="mt-2 text-text-secondary">
          You need to verify your business to access {feature}.
        </p>
        <p className="mt-4 text-sm text-text-muted">
          Verification helps protect the network from misuse and ensures data quality for all members.
        </p>
        <Link
          href="/app/verify"
          className="mt-6 inline-block rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark"
        >
          Verify Your Business
        </Link>
      </div>
    </div>
  );
}

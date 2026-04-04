import Link from "next/link";
import { PrismLogoFull } from "@/components/PrismLogo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <Link href="/">
            <PrismLogoFull height={36} />
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[var(--rc-text-primary)] mb-3">
          Page not found
        </h1>
        <p className="text-[var(--rc-text-secondary)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/build"
            className="rounded-full bg-[#111111] dark:bg-white px-8 py-3 text-sm font-medium text-white dark:text-[#111111] hover:opacity-90 transition-opacity"
          >
            Build my council →
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)] transition-colors"
          >
            Back to home →
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BuildLoading() {
  return (
    <main className="min-h-screen pb-24 bg-[var(--background)]">
      <header className="px-6 sm:px-12 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-9 w-36 rounded bg-[var(--rc-surface)] animate-pulse" />
          <div className="h-8 w-20 rounded bg-[var(--rc-surface)] animate-pulse" />
        </div>
      </header>

      <div className="bg-[var(--rc-surface)] border-y border-[var(--rc-border)] mt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="h-8 w-64 rounded bg-[var(--rc-border)] animate-pulse" />
            <div className="h-5 w-48 rounded bg-[var(--rc-border)] animate-pulse" />
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-4 space-y-3"
              >
                <div className="h-8 w-8 rounded bg-[var(--rc-border)] animate-pulse" />
                <div className="h-5 w-24 rounded bg-[var(--rc-border)] animate-pulse" />
                <div className="h-4 w-full rounded bg-[var(--rc-border)] animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-[var(--rc-border)] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

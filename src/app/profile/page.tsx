import Link from "next/link";

const recentArticles = [
  "Designing a calmer developer workflow",
  "Shipping with thoughtful defaults",
  "How I keep writing without burning out",
];

export default function ProfilePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Member profile</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Welcome back, Maya</h1>
        </div>
        <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
          Back to home
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
            MA
          </div>
          <h2 className="text-xl font-semibold">Maya Anderson</h2>
          <p className="mt-2 text-sm text-muted-foreground">Product designer and systems thinker.</p>
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p>12 saved reads</p>
            <p>7 article comments</p>
            <p>Last active 2 hours ago</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Recent reading</h2>
          <ul className="mt-5 space-y-4">
            {recentArticles.map((article) => (
              <li key={article} className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground">
                {article}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

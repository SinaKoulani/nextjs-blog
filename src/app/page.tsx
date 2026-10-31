import Link from "next/link";

const featuredPosts = [
  {
    title: "Designing a calmer developer workflow",
    category: "Productivity",
    readTime: "6 min read",
    excerpt:
      "Small rituals and clean tools can reduce friction before the work even starts.",
  },
  {
    title: "Shipping faster with strong defaults",
    category: "Engineering",
    readTime: "4 min read",
    excerpt:
      "A thoughtful system of defaults turns momentum into repeatable output.",
  },
  {
    title: "Writing content that still feels human",
    category: "Creativity",
    readTime: "7 min read",
    excerpt:
      "The best technical stories teach through experience instead of sounding generic.",
  },
];

const quickLinks = ["AI workflows", "Remote teams", "UX systems", "Build in public"];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Northstar Journal
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground md:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Join now
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.25fr_0.75fr] md:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Weekly deep dives for builders
          </div>
          <div className="space-y-6">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Notes from the edge of product, code, and craft.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              Fresh perspectives, practical systems, and stories from teams shipping thoughtfully in a noisy world.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground"
            >
              Read the latest
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>6,200 readers</span>
            <span>•</span>
            <span>3 posts this week</span>
            <span>•</span>
            <span>New essays every Friday</span>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-muted p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>Featured story</span>
            <span>12 min</span>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 p-6 text-zinc-50">
              <div className="mb-4 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-200">
                Product design
              </div>
              <h2 className="text-2xl font-semibold">The quiet systems behind durable teams</h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              The strongest products rarely come from bursts of brilliance. They emerge from reliable rituals, clear ownership, and a realistic pace.
            </p>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((item) => (
                <span key={item} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Latest articles</h2>
          <Link href="/signup" className="text-sm font-medium text-foreground">
            Subscribe
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <article key={post.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-xl font-semibold leading-snug text-foreground">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              <Link href="/login" className="mt-5 inline-flex text-sm font-medium text-foreground">
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

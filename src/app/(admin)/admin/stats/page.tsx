"use client";

import { useEffect, useState } from "react";
import { fetchStatsOverview } from "@/api/services/admin/stats.service";

type StatsOverview = Record<string, unknown>;

function isStatsOverview(value: unknown): value is StatsOverview {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNumber(data: StatsOverview, ...keys: string[]): number {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      const response = await fetchStatsOverview();

      if (!response.isOK) {
        setError(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!isStatsOverview(response.data)) {
        setError("Unexpected response shape from GET /analytics/overview");
        setIsLoading(false);
        return;
      }

      setStats(response.data);
      setIsLoading(false);
    }

    loadStats();
  }, []);

  const totalViews = stats ? getNumber(stats, "totalViews", "views") : 0;

  const totalPosts = stats ? getNumber(stats, "totalPosts", "posts") : 0;

  const totalUsers = stats ? getNumber(stats, "totalUsers", "users") : 0;

  const totalCategories = stats
    ? getNumber(stats, "totalCategories", "categories")
    : 0;

  const totalTags = stats ? getNumber(stats, "totalTags", "tags") : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
          Statistics
        </h1>

        <p className="mt-1 text-sm text-[#828997]">
          Overview of your content and users.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading statistics...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#d19a66]">{error}</p>
        </div>
      )}

      {!isLoading && !error && stats && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard title="Total Views" value={totalViews} />
          <StatsCard title="Total Posts" value={totalPosts} />
          <StatsCard title="Users" value={totalUsers} />
          <StatsCard title="Categories" value={totalCategories} />
          <StatsCard title="Tags" value={totalTags} />
        </section>
      )}
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-5 transition-colors hover:border-[#d19a66]/50">
      <div className="mb-5 h-1 w-9 rounded-full bg-[#d19a66]/80" />

      <p className="text-sm text-[#828997]">{title}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d7dae0]">
        {value}
      </p>
    </div>
  );
}

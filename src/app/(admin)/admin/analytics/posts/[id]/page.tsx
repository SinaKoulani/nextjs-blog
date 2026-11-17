"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAdminPost } from "@/api/services/admin/posts.service";
import {
  fetchPostAnalytics,
  getPostViewCount,
} from "@/api/services/admin/analytics.service";
import type { Post } from "@/types/post.type";

type PostDetailsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; post: Post; analytics: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatMetric(value: unknown): string {
  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

export default function AdminPostDetailsPage() {
  const params = useParams<{ id: string }>();
  const [state, setState] = useState<PostDetailsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function loadPostDetails() {
      const postId = Number(params.id);

      if (!Number.isInteger(postId) || postId <= 0) {
        setState({ status: "error", message: "Invalid post ID." });
        return;
      }

      const [postResult, analyticsResult] = await Promise.all([
        fetchAdminPost(postId),
        fetchPostAnalytics(postId),
      ]);

      if (cancelled) {
        return;
      }

      if (!postResult.isOK) {
        setState({ status: "error", message: postResult.error.displayMessage });
        return;
      }

      if (!analyticsResult.isOK) {
        setState({
          status: "error",
          message: analyticsResult.error.displayMessage,
        });
        return;
      }

      setState({
        status: "ready",
        post: postResult.data,
        analytics: analyticsResult.data,
      });
    }

    void loadPostDetails();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
        Loading post analytics...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/admin/analytics"
          className="text-sm font-medium text-[#d19a66] hover:underline"
        >
          Back to posts
        </Link>
        <p
          role="alert"
          className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 text-sm text-[#d19a66]"
        >
          {state.message}
        </p>
      </div>
    );
  }

  const views = getPostViewCount(state.analytics);
  const metrics = isRecord(state.analytics)
    ? Object.entries(state.analytics)
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#828997]">Post analytics</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#d7dae0]">
            {state.post.title}
          </h1>
        </div>
        <Link
          href="/admin/analytics"
          className="text-sm font-medium text-[#d19a66] hover:underline"
        >
          Back to posts
        </Link>
      </div>

      <section className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6">
        <p className="text-sm text-[#828997]">Total views</p>
        <p className="mt-2 text-4xl font-semibold text-[#d7dae0]">
          {views === null ? "Unavailable" : views.toLocaleString()}
        </p>
      </section>

      {metrics.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#d7dae0]">
            Analytics details
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {metrics.map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-[#3e4451] bg-[#21252b] p-4"
              >
                <dt className="text-xs text-[#828997]">{key}</dt>
                <dd className="mt-1 break-words text-sm text-[#abb2bf]">
                  {formatMetric(value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}

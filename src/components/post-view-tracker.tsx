"use client";

import { useEffect, useRef } from "react";
import { getToken } from "@/api/auth.token";
import { recordPostView } from "@/api/services/admin/stats.service";

export function PostViewTracker({ postId }: { postId: number }) {
  const trackedPostId = useRef<number | null>(null);

  useEffect(() => {
    if (trackedPostId.current === postId || !getToken()) {
      return;
    }

    trackedPostId.current = postId;
    void recordPostView(postId);
  }, [postId]);

  return null;
}

import { getAnalytics } from "@/api/generated/analytics/analytics";
import type {
  AnalyticsControllerGetPostAnalyticsParams,
  AnalyticsControllerGetPopularPostsParams,
  AnalyticsControllerGetDailyViewsParams,
} from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";

const {
  analyticsControllerRecordVisit,
  analyticsControllerGetOverview,
  analyticsControllerGetPostAnalytics,
  analyticsControllerGetPopularPosts,
  analyticsControllerGetDailyViews,
} = getAnalytics();

export function recordPostView(
  postId: number,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await analyticsControllerRecordVisit(postId);
  });
}

export function fetchAnalyticsOverview(): Promise<HttpResponseType<unknown>> {
  return safeCall(async () => {
    const data: unknown = await analyticsControllerGetOverview();

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /analytics/overview");
    }

    return data;
  });
}

export function fetchPostAnalytics(
  postId: number,
  params?: AnalyticsControllerGetPostAnalyticsParams,
): Promise<HttpResponseType<unknown>> {
  return safeCall(async () => {
    const data: unknown = await analyticsControllerGetPostAnalytics(
      postId,
      params,
    );

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error(
        "Unexpected response shape from GET /analytics/posts/{postId}",
      );
    }

    return data;
  });
}

export function getPostViewCount(analytics: unknown): number | null {
  if (
    typeof analytics !== "object" ||
    analytics === null ||
    Array.isArray(analytics)
  ) {
    return null;
  }

  const record = analytics as Record<string, unknown>;

  for (const key of ["totalViews", "viewsCount", "viewCount", "views"]) {
    if (typeof record[key] === "number") {
      return record[key];
    }
  }

  for (const key of ["analytics", "data"]) {
    const count = getPostViewCount(record[key]);
    if (count !== null) {
      return count;
    }
  }

  return null;
}

export function fetchPopularPosts(
  params?: AnalyticsControllerGetPopularPostsParams,
): Promise<HttpResponseType<unknown[]>> {
  return safeCall(async () => {
    const data: unknown = await analyticsControllerGetPopularPosts(params);

    if (!Array.isArray(data)) {
      throw new Error(
        "Unexpected response shape from GET /analytics/posts/popular",
      );
    }

    return data;
  });
}

export function fetchDailyViewAnalytics(
  params?: AnalyticsControllerGetDailyViewsParams,
): Promise<HttpResponseType<unknown[]>> {
  return safeCall(async () => {
    const data: unknown = await analyticsControllerGetDailyViews(params);

    if (!Array.isArray(data)) {
      throw new Error(
        "Unexpected response shape from GET /analytics/views/daily",
      );
    }

    return data;
  });
}

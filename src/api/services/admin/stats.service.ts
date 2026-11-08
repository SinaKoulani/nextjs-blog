import { getAnalytics } from "@/api/generated/analytics/analytics";
import type {
  AnalyticsControllerGetPostStatsParams,
  AnalyticsControllerGetPopularPostsParams,
  AnalyticsControllerGetDailyViewsParams,
} from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";

const {
  analyticsControllerRecordVisit,
  analyticsControllerGetOverview,
  analyticsControllerGetPostStats,
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

export function fetchStatsOverview(): Promise<HttpResponseType<unknown>> {
  return safeCall(async () => {
    const data: unknown = await analyticsControllerGetOverview();

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /analytics/overview");
    }

    return data;
  });
}

export function fetchPostStats(
  postId: number,
  params?: AnalyticsControllerGetPostStatsParams,
): Promise<HttpResponseType<unknown>> {
  return safeCall(async () => {
    const data: unknown = await analyticsControllerGetPostStats(postId, params);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error(
        "Unexpected response shape from GET /analytics/posts/{postId}",
      );
    }

    return data;
  });
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

export function fetchDailyViewStats(
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

import { getPosts } from "@/api/generated/posts/posts";
import type { PostsControllerFindPublishedParams } from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";
import type { Post } from "@/types/post.type";

const { postsControllerFindPublished, postsControllerFindPublishedOne } =
  getPosts();

/**
 * Fetches the published posts (`GET /posts`).
 *
 * The generated Orval function returns `void` because the Swagger file has no
 * response schema, so the result is cast to `Post[]` here. This is the only
 * place that cast lives: when the backend adds response types, remove it and
 * the rest of the app keeps working.
 *
 * The array check below turns an unexpected response shape (for example an
 * object with pagination) into a normal error instead of a crash on the page.
 *
 * @param params Optional filters: search, categoryId, tagId, sortBy, sortOrder.
 * @returns `{ isOK: true, data }` or `{ isOK: false, error }`, never throws.
 *
 * @example
 * const result = await fetchPublishedPosts({ sortBy: "createdAt", sortOrder: "DESC" });
 * if (!result.isOK) return <p>{result.error.displayMessage}</p>;
 */
export function fetchPublishedPosts(
  params?: PostsControllerFindPublishedParams,
): Promise<HttpResponseType<Post[]>> {
  return safeCall(async () => {
    const data: unknown = await postsControllerFindPublished(params);

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /posts");
    }

    return data as Post[];
  });
}

/**
 * Fetches one published post (`GET /posts/{id}`).
 *
 * Like `fetchPublishedPosts`, the response is cast to `Post` here because the
 * Swagger file has no response schema. The object check turns an unexpected
 * shape into a normal error instead of a crash on the page.
 *
 * @param id Numeric post id. The backend answers 400 for non-integers and 404
 * when the post does not exist or is not published.
 * @returns `{ isOK: true, data }` or `{ isOK: false, error }`, never throws.
 *
 * @example
 * const result = await fetchPublishedPost(1);
 * if (!result.isOK && result.error.statusCode === 404) notFound();
 */
export function fetchPublishedPost(
  id: number,
): Promise<HttpResponseType<Post>> {
  return safeCall(async () => {
    const data: unknown = await postsControllerFindPublishedOne(id);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /posts/{id}");
    }

    return data as Post;
  });
}
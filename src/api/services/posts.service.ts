import { cache } from "react";
import { getPosts } from "@/api/generated/posts/posts";
import type { PostsControllerFindPublishedParams } from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";
import type { Post } from "@/types/post.type";

const { postsControllerFindPublished, postsControllerFindPublishedOne } =
  getPosts();

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

export const fetchPublishedPost = cache(
  (id: number): Promise<HttpResponseType<Post>> =>
    safeCall(async () => {
      const data: unknown = await postsControllerFindPublishedOne(id);

      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error("Unexpected response shape from GET /posts/{id}");
      }

      return data as Post;
    }),
);

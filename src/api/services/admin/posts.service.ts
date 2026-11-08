import { getPosts } from "@/api/generated/posts/posts";
import type {
  CreatePostDto,
  UpdatePostDto,
} from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";
import type { Post } from "@/types/post.type";

const {
  postsControllerCreate,
  postsControllerFindAllForAdmin,
  postsControllerFindOneForAdmin,
  postsControllerUpdate,
  postsControllerRemove,
} = getPosts();

export function createPost(
  data: CreatePostDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await postsControllerCreate(data);
  });
}

export function fetchAdminPosts(): Promise<HttpResponseType<Post[]>> {
  return safeCall(async () => {
    const data: unknown = await postsControllerFindAllForAdmin();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /posts/admin/all");
    }

    return data as Post[];
  });
}

export function fetchAdminPost(id: number): Promise<HttpResponseType<Post>> {
  return safeCall(async () => {
    const data: unknown = await postsControllerFindOneForAdmin(id);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /posts/admin/{id}");
    }

    return data as Post;
  });
}

export function updatePost(
  id: number,
  data: UpdatePostDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await postsControllerUpdate(id, data);
  });
}

export function deletePost(id: number): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await postsControllerRemove(id);
  });
}

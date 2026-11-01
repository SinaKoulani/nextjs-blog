/**
 * One content block of a post, as returned by `GET /posts/{postId}/blocks`.
 *
 * TEMPORARY: the Swagger file has no response schema, so these fields are
 * inferred from `CreateBlockDto`. Once the backend adds `@ApiResponse` types and
 * Orval generates them, delete this file and import the generated type instead.
 */
export interface Block {
  id: number;
  /** Decides which of `content` or `mediaId` is meaningful. */
  type: "text" | "image";
  /** Text of the block. Present when `type` is `"text"`. */
  content?: string | null;
  /** Media resource id. Present when `type` is `"image"`. */
  mediaId?: number | null;
  /** Order of the block inside the post, starting at 1. */
  position: number;
}

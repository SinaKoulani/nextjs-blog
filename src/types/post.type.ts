/**
 * A published blog post as returned by `GET /posts`.
 *
 * TEMPORARY: the Swagger file has no response schema yet, so these fields are
 * inferred from `UpdatePostDto` and the `sortBy` values. Once the backend adds
 * `@ApiResponse` types and Orval generates them, delete this file and import
 * the generated type instead.
 */
export interface Post {
  id: number;
  title: string;
  slug: string;
  /** Short summary; the backend allows `null`. */
  excerpt: string | null;
  /** ISO date string. */
  createdAt: string;
  /** ISO date string. */
  updatedAt: string;
}
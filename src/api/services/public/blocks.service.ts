import type { Block } from "@/types/block.type";
import type { BlocksControllerGetNextBlocksParams } from "@/api/generated/nestBlogApi.schemas";
import type { HttpResponseType } from "@/api/err/http-response";
import { getBlocks } from "@/api/generated/blocks/blocks";
import { safeCall } from "@/api/err/safe-call";

const { blocksControllerGetInitialBlocks, blocksControllerGetNextBlocks } =
  getBlocks();

/**
 * Fetches the initial content blocks of a published post
 * (`GET /posts/{postId}/blocks`).
 *
 * The generated Orval function returns `void` because the Swagger file has no
 * response schema, so the result is cast to `Block[]` here. This is the only
 * place that cast lives: when the backend adds response types, remove it and
 * the rest of the app keeps working.
 *
 * The array check turns an unexpected response shape into a normal error
 * instead of a crash on the page.
 *
 * @param postId Numeric post id. The backend answers 400 for an invalid id and
 * 404 when the post does not exist.
 * @returns `{ isOK: true, data }` or `{ isOK: false, error }`, never throws.
 *
 * @example
 * const result = await fetchInitialBlocks(1);
 * if (result.isOK) console.log(result.data.length);
 */
export function fetchInitialBlocks(
  postId: number,
): Promise<HttpResponseType<Block[]>> {
  return safeCall(async () => {
    const data: unknown = await blocksControllerGetInitialBlocks(postId);

    if (!Array.isArray(data)) {
      throw new Error(
        "Unexpected response shape from GET /posts/{postId}/blocks",
      );
    }

    return data as Block[];
  });
}

export function fetchNextBlocks(
  postId: number,
  params: BlocksControllerGetNextBlocksParams,
): Promise<HttpResponseType<Block[]>> {
  return safeCall(async () => {
    const data: unknown = await blocksControllerGetNextBlocks(postId, params);

    if (!Array.isArray(data)) {
      throw new Error(
        "Unexpected response shape from GET /posts/{postId}/blocks/next",
      );
    }

    return data as Block[];
  });
}

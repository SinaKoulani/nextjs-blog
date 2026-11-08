import type { CreateBlockDto, UpdateBlockDto } from "@/api/generated/nestBlogApi.schemas";
import type { HttpResponseType } from "@/api/err/http-response";
import { getBlocks } from "@/api/generated/blocks/blocks";
import { safeCall } from "@/api/err/safe-call";

const { blocksControllerCreate, blocksControllerUpdate, blocksControllerRemove } =
  getBlocks();

export function createBlock(
  postId: number,
  data: CreateBlockDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await blocksControllerCreate(postId, data);
  });
}

export function updateBlock(
  id: number,
  data: UpdateBlockDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await blocksControllerUpdate(id, data);
  });
}

export function deleteBlock(id: number): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await blocksControllerRemove(id);
  });
}

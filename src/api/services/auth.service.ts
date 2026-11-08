import { getAuth } from "@/api/generated/auth/auth";
import type { ChangePasswordDto } from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";

const { authControllerChangePassword } = getAuth();

export function changeMyPassword(
  dto: ChangePasswordDto,
): Promise<HttpResponseType<void>> {
  return safeCall(() => authControllerChangePassword(dto));
}

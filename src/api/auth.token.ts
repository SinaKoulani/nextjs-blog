const TOKEN_KEY = "auth_token";
const TOKEN_FIELDS = ["accessToken", "access_token", "token"] as const;
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function extractToken(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  const record = data as Record<string, unknown>;

  for (const field of TOKEN_FIELDS) {
    const value = record[field];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return null;
}

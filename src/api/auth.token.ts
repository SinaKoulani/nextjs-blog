const TOKEN_KEY = "auth_token";
const EXPIRED_KEY = "auth_expired";
const TOKEN_FIELDS = ["accessToken", "access_token", "token"] as const;

/**
 * Fired on `window` whenever the token is set or cleared in this tab.
 * The native `storage` event only reaches other tabs, so same-tab
 * listeners (like the site header) subscribe to this one as well.
 */
export const AUTH_CHANGE_EVENT = "auth-token-change";

function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}

export function markSessionExpired(): void {
  window.sessionStorage.setItem(EXPIRED_KEY, "1");
}

export function consumeSessionExpired(): boolean {
  const expired = window.sessionStorage.getItem(EXPIRED_KEY) === "1";
  window.sessionStorage.removeItem(EXPIRED_KEY);
  return expired;
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

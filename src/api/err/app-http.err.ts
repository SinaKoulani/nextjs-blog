import { AxiosError, isAxiosError } from "axios";

/**
 * Wraps any error thrown during an API call into one consistent shape.
 *
 * Pages and services never inspect raw axios errors. They read `statusCode`
 * and `displayMessage` from this class instead.
 *
 * @example
 * const err = new appHttpErr(caughtError);
 * setError(err.displayMessage);
 */
export class appHttpErr extends Error {
    /** The original thrown value, kept for debugging and status extraction. */
    private readonly _originalError: unknown;

    /**
     * @param error Anything caught in a `catch` block (always `unknown` in TS).
     */
    constructor(error: unknown) {
        super(error instanceof Error ? error.message : "unknown error, we coocked");
        this.name = "appHttpErr";
        this._originalError = error;
    }

    /** True when the original error came from axios. */
    get isAxiosError(): boolean {
        return isAxiosError(this._originalError);
    }

    /**
     * Numeric status of the failure:
     * - a real HTTP status (400, 401, 404, ...) when the server responded
     * - `0` when no response arrived (server down, network lost, CORS)
     * - `-1` when the error did not come from axios at all (a bug in our code)
     */
    get statusCode(): number {
        if (!this.isAxiosError) {
            return -1;
        }

        return (this._originalError as AxiosError).response?.status ?? 0;
    }

    /** User-facing message for the current `statusCode`. */
    get displayMessage(): string {
        switch (this.statusCode) {
            case 0:
                return "Unable to connect to the server. Please try again later.";
            case 400:
                return "Invalid request data.";
            case 401:
                return "Invalid email or password.";
            case 403:
                return "You do not have permission to perform this action.";
            case 404:
                return "The requested resource was not found.";
            case 409:
                return "An account with this email already exists.";
            case 422:
                return "Please check the information you entered.";
            case 500:
                return "Server error. Please try again later.";
            case 502:
                return "A network error occurred. Please try again later.";
            default:
                return "An unexpected error occurred.";
        }
    }

    /**
     * Sends the user to `/<statusCode>?source=<current url>`.
     *
     * Client-only: it reads `window`, so it does nothing on the server.
     * Pass a navigation function (for example from `useRouter`) instead of
     * assigning `window.location.href`, which would reload the whole page.
     * Use it for data pages (e.g. a missing post), not for form errors.
     *
     * @param navigate Function that performs the client-side navigation.
     *
     * @example
     * const router = useRouter();
     * if (!result.isOK) result.error.redirect((url) => router.push(url));
     */
    redirect(navigate: (url: string) => void): void {
        if (typeof window === "undefined") {
            return;
        }

        const source = encodeURIComponent(window.location.href);
        navigate(`/${this.statusCode}?source=${source}`);
    }
}

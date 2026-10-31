import { AxiosError, isAxiosError } from "axios";


/**
 * this file wraps any error thrown during an API call into one consistent shape.
 * 
 * pages and service never inspect raw axios errors. they read "statusCode" 
 * and "displayMessage" from this class instead
 * 
 * @example
 * const err = new appHttpErr(caughtError);
 * setError(err.displayMEssage);
 */

export class appHttpErr extends Error {
    /**the original thrown value ,kept for debugging and status extraction */
    private readonly _originalError : unknown;

    /**
     * 
     * @param error anything catch in a 'catch' block (always 'unknown' in ts)
     */


    constructor(error : unknown) {
        super(error instanceof Error ? error.message : "unknown error, we coocked");
        this.name= "appHttpErr"
        this._originalError= error;

    }

    /**true when the original error came from axios */
    get isAxiosError(): boolean {
        return isAxiosError(this._originalError);

    }

    /**
     * a real HTTP status (400, 401, 404, ...) when the server responsed
     * 0 when no response arrived (server down, network lost, CORS)
     * -1 when the error did not come from axios at all (a bug in our code)
     */
    get statusCode(): number{
        if (!this.isAxiosError){
            return -1;
        }
        
        return (this._originalError as AxiosError).response?.status ?? 0;
    }

    /**and we show message for the current statusCode */
    get displayMessage(): string{
        switch(this.statusCode){
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
     * and finally sends the user to /<statusCode>?source=<current url>
     * client-only it uses window , so never call it in a server component
     * use it for data pages (e.g. a missing post), not for form errors.
     */
    redirect(): void {

        /**
         * check if window exist
         */
        if (typeof window === "undefined"){
            return;
        }
        const source = encodeURIComponent(window.location.href);
        window.location.href = `/${this.statusCode}?source=${source}`;
    }
}

/**
 * btw "window" is a browser object that gives us access to the current page URL.
 */
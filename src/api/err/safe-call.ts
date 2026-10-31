import type { HttpResponseType} from "./http-response";
import { appHttpErr } from "./app-http.err";

/**
 * runs any api call and never throws
 * this is the only try catch in project
 * 
 * @example 
 * const result = await safeCall(() => 
 * authControllerLogin(data));
 * if (!result.isOK){
 *      setError(result.error.displayMessage);
 *      return;
 * }
 */


export async function safeCall<T> (
    fn: () => Promise<T>,
): Promise<HttpResponseType<T>> {
    try{
        const data = await fn();
        return{ isOK: true , data };

    } catch(error){
        return{ isOK: false , error: new appHttpErr(error)};
    }
}
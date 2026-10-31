import type { appHttpErr } from "./app-http.err";

/**
 * 
 * result of evry api call made throgh "safeCall"
 * success: `{ isOK: true, data }`
 * failure: `{ isOK: false, error }`
 */



export type HttpResponseType< T = unknown > = 
    | {isOK :true; data :T}
    | {isOK :false; error :appHttpErr }
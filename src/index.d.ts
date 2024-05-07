import { Observable } from "rxjs";

/**
 * Configuration options for MoongooseClient.
 */
export interface Config {
    /**
     * The maximum number of service calls during a specified time window.
     */
    maxCalls?: number;

    /**
     * The duration of the time window in milliseconds after which the call count resets.
     */
    callsResetAfterMilliseconds?: number;

    /**
     * The duration in milliseconds to wait before retrying a service call.
     */
    retryCallInMilliseconds?: number;
}

/**
 * A client for making throttled requests with automatic retries. (Not a singleton, instantiate as much as you want)
 */
export class MoongooseClient {
    /**
     * Initializes the client with specific configurations.
     * @param config The configuration settings.
     */
    initialize(config: Config): void;

    /**
     * Performs a GET request.
     * @param url The URL to request.
     * @param headers Optional headers for the request.
     * @returns An Observable of the response type.
     */
    get<Type>(url: string, headers?: Record<string, string>): Observable<Type>;

    /**
     * Performs a POST request.
     * @param url The URL to post to.
     * @param data The data to be posted.
     * @param headers Optional headers for the request.
     * @returns An Observable of the response type.
     */
    post<Type>(url: string, data: any, headers?: Record<string, string>): Observable<Type>;
}

/**
 * The way the library creator uses it, this is a singleton
 */
export declare const MGClient: MoongooseClient;
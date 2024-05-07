import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Observable, Subscriber, mergeMap, throwError, timer } from "rxjs";

interface Config {
    /**
     * The maximum number of service during a specified time window
     */
    maxCalls?: number,
    /**
     * The time window
     */
    callsResetAfterMilliseconds?: number,
    /**
     * How long should the client wait before checking if it can make another request
     */
    retryCallInMilliseconds?: number
}

class MoongooseClient {
    private config = {
        maxCalls: 10,
        callsResetAfterMilliseconds: 1000,
        retryCallInMilliseconds: 250
    }

    private currentCalls: number = 0;
    private isInitialized = false;

    public initialize(config: Config) {
        this.config = { ...this.config, ...config };
    }


    public get<Type>(url: string, headers?: Record<string, string>): Observable<Type> {
        this.checkInitialized();
        return this.makeRequest<Type>({
            method: 'get',
            url,
            headers,
        })
    };
    public post<Type>(url: string, data: any, headers?: Record<string, string>): Observable<Type> {
        this.checkInitialized();
        return this.makeRequest<Type>({
            method: 'post',
            url,
            data,
            headers,
        })
    };

    private makeRequest<Type>(config: AxiosRequestConfig): Observable<Type> {
        if (this.canMakeServiceCall()) {
            this.currentCalls++;
            setTimeout(() => { this.currentCalls-- }, this.config.callsResetAfterMilliseconds);
            return new Observable<Type>((handle: Subscriber<Type>) => {
                axios(config).then((res: AxiosResponse) => {
                    handle.next(res.data);
                }).catch((err: any) => {
                    handle.error(err);
                }).finally(() => {
                    handle.complete()
                });
            })
        }
        else {
            return timer(this.config.retryCallInMilliseconds).pipe(
                mergeMap(() => {
                    return this.makeRequest<Type>(config)
                }));
        }
    }

    private checkInitialized() {
        if (!this.isInitialized) throwError(() => new Error("Client has not been initialized"));
    }

    private canMakeServiceCall(): boolean {
        return this.currentCalls < this.config.maxCalls;
    }
}

const MGClient = new MoongooseClient();

export { MGClient };

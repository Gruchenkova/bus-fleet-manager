import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';

export class HttpResponse<T> {
    successResponse: boolean | undefined;
    statusCode: number | undefined;
    content: T | undefined;
    headers?: {};
}

export interface RequestParams {
    url?: string;
    headers?: AxiosRequestHeaders;
    data?: object;
    timeout?: number;
    rejectUnauthorized?: boolean;
    params?: object;
}

export class HttpClient {
    public static get<T>(requestParams: RequestParams): Promise<HttpResponse<T>> {
        return this.request('GET', requestParams);
    }

    public static post<T>(requestParams: RequestParams): Promise<HttpResponse<T>> {
        return this.request('POST', requestParams);
    }

    public static put<T>(requestParams: RequestParams): Promise<HttpResponse<T>> {
        return this.request('PUT', requestParams);
    }

    public static del<T>(requestParams: RequestParams): Promise<HttpResponse<T>> {
        return this.request('DELETE', requestParams);
    }

    private static async request<T>(method: string, requestParams: RequestParams): Promise<HttpResponse<T>> {
        const httpResponse = new HttpResponse<T>();
        const rejectUnauthorized = requestParams.rejectUnauthorized || true;
        let response;
        let responseStatus;
        let options: AxiosRequestConfig;

        try {
            options = {
                method: method as Method,
                url: requestParams.url,
                headers: requestParams.headers,
                data: requestParams.data,
                timeout: (requestParams.timeout || 30) * 1000,
                params: requestParams.params || {},
                withCredentials: true
            };

            response = await axios(options);

            httpResponse.successResponse = true;
            httpResponse.statusCode = response.status;
            httpResponse.content = response.data as T;
            httpResponse.headers = response.headers;
        } catch (e) {
            httpResponse.successResponse = false;

            if (e instanceof AxiosError) {
                httpResponse.statusCode = e.response?.status;
                httpResponse.content = e.response?.data as T;
            }
        }

        return httpResponse;
    }
}
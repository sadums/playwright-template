import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * ApiClient — thin wrapper around Playwright's APIRequestContext.
 *
 * Use this in test setup (beforeAll / fixture setup) to create or clean up
 * server-side state without going through the browser UI.
 *
 * Example:
 *   const api = new ApiClient(request, process.env.API_BASE_URL!);
 *   await api.post('/users', { body: createUser() });
 */
export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  async get(path: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<APIResponse> {
    const response = await this.request.get(`${this.baseUrl}${path}`, options);
    return response;
  }

  async post(
    path: string,
    options?: Parameters<APIRequestContext['post']>[1],
  ): Promise<APIResponse> {
    const response = await this.request.post(`${this.baseUrl}${path}`, options);
    return response;
  }

  async put(path: string, options?: Parameters<APIRequestContext['put']>[1]): Promise<APIResponse> {
    const response = await this.request.put(`${this.baseUrl}${path}`, options);
    return response;
  }

  async delete(
    path: string,
    options?: Parameters<APIRequestContext['delete']>[1],
  ): Promise<APIResponse> {
    const response = await this.request.delete(`${this.baseUrl}${path}`, options);
    return response;
  }

  /** Assert response is OK (2xx) and return parsed JSON body. */
  async expectOk<T = unknown>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `API request failed: ${response.status()} ${response.statusText()}\nBody: ${body}`,
      );
    }
    return response.json() as Promise<T>;
  }
}

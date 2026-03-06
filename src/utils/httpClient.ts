import { IHttpClient } from "../interfaces/IHttpClient.js";
import { API_BASE_URL } from "../config/env.js";

export class HttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(
        `HTTP GET ${fullUrl} failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as T;
    return data;
  }
}

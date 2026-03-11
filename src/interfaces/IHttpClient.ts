export interface IHttpClient {
  get<T>(url: string): Promise<T>;
}

//SRP (Single Responsibility Principle)
// can be imported annywhere instead of existing in the httpCline

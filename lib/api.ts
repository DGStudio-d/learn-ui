import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export const http = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError<any>) => {
    const message = (error.response?.data as any)?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

// Generic API fetcher that returns the response data with typing support
// Example: const result = await apiFetch<{ data: MyType[] }>({ path: "/items" })
export async function apiFetch<T>(options: {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}): Promise<T> {
  const { path, method = "GET", body, params, headers } = options;
  const res = await http.request<T>({
    url: path,
    method,
    data: body,
    params,
    headers,
  });
  return res.data as unknown as T;
}

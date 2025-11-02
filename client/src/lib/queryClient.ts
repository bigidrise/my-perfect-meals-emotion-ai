import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let message = res.statusText; // default

    try {
      // Try JSON first
      const data = await res.clone().json();
      if (data?.error) message = data.error;
      else if (data?.message) message = data.message;
      else message = JSON.stringify(data);
    } catch {
      try {
        // Fall back to plain text
        const text = await res.clone().text();
        if (text && !text.startsWith("<")) message = text; // skip HTML
      } catch {
        // Nothing usable, leave default statusText
      }
    }

    throw new Error(`${res.status}: ${message}`);
  }
}

// Get API base URL from environment variable or default to same origin
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  }
): Promise<any> {
  const { method = "GET", body, headers = {} } = options || {};
  
  // Get userId from localStorage for authentication
  const userId = localStorage.getItem("userId");
  const authHeaders = userId ? { "x-user-id": userId } : {};
  
  // Prepend API base URL if provided and URL is relative
  const fullUrl = url.startsWith('/') && API_BASE_URL ? `${API_BASE_URL}${url}` : url;
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Check if response is HTML (indicating Vite middleware interference)
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("text/html")) {
    throw new Error(`API route intercepted by Vite middleware. Expected JSON but got HTML from ${url}`);
  }
  
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Build URL with API base if needed
    const relativeUrl = queryKey.join("/") as string;
    const fullUrl = relativeUrl.startsWith('/') && API_BASE_URL ? `${API_BASE_URL}${relativeUrl}` : relativeUrl;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000, // 1 minute instead of Infinity for stability
      retry: 2,
      throwOnError: false, // Prevent unhandled rejections in v5
    },
    mutations: {
      retry: 2,
      throwOnError: false, // Prevent unhandled rejections in v5
    },
  },
});

// Cache persistence will be added later when packages are installed
// For now, relying on improved staleTime and retry logic for stability

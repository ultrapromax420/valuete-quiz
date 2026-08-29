export const apiBase = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`;

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${apiBase}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...(headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(
      data?.error?.message || data?.message || "Request failed",
    ) as Error & { status?: number; payload?: any; code?: string };
    error.status = response.status;
    error.payload = data;
    error.code = data?.error?.code;
    throw error;
  }

  return data;
}

export async function apiFetch<T = any>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  return apiRequest<T>(path, { ...options, token });
}

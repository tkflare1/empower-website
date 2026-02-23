const STORAGE_KEY = "empower_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAdminToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token || "",
      ...(options.headers || {}),
    },
  });
}

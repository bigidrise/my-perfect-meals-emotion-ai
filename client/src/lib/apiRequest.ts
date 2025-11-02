import { getDeviceId } from "@/utils/deviceId";

export async function apiRequest(path: string, init: RequestInit = {}) {
  const userId = localStorage.getItem("userId") || "";
  const deviceId = getDeviceId();
  
  const headers = new Headers(init.headers || {});
  if (userId && !headers.has("x-user-id")) headers.set("x-user-id", userId);
  if (!headers.has("X-Device-Id")) headers.set("X-Device-Id", deviceId);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(path, { ...init, headers, credentials: "include" });
  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok || data?.ok === false) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

import { getDeviceId } from "./deviceId";

export async function fetchWithDevice(input: RequestInfo, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("X-Device-Id", getDeviceId());
  return fetch(input, { ...init, headers });
}
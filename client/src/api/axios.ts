import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 8000,
});

export default api;

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    if (err.response) {
      return err.response.data?.message ?? `Request failed with status ${err.response.status}.`;
    }
    return "Cannot reach the server. Make sure the API is running.";
  }
  return "Something went wrong. Please try again.";
}

export function getFieldErrors(err: unknown): Record<string, string> | null {
  if (isAxiosError(err) && err.response?.status === 400) {
    return err.response.data?.errors ?? null;
  }
  return null;
}
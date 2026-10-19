import { useState, useEffect } from "react";
import { isCancel } from "axios";
import api, { getErrorMessage } from "../api/axios";

export function useFetch<T>(url: string, params: Record<string, string> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<T>(url, {
          params: JSON.parse(paramsKey),
          signal: controller.signal,
        });
        setData(res.data);
      } catch (err) {
        if (isCancel(err)) return; 
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => controller.abort(); 
  }, [url, paramsKey, reloadCount]);

  function refetch() {
    setReloadCount((count) => count + 1);
  }

  return { data, setData, loading, error, refetch };
}
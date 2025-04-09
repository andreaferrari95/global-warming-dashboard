import { useEffect, useState } from "react";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  intervalMs: number = CACHE_TTL_MS,
) {
  const [data, setData] = useState<T | null>(null);

  const load = async () => {
    const cached = localStorage.getItem(key);
    const cachedAt = localStorage.getItem(`${key}_ts`);

    const now = Date.now();
    const isFresh =
      cached && cachedAt && now - parseInt(cachedAt) < CACHE_TTL_MS;

    if (isFresh) {
      setData(JSON.parse(cached));
    } else {
      const fresh = await fetcher();

      setData(fresh);
      localStorage.setItem(key, JSON.stringify(fresh));
      localStorage.setItem(`${key}_ts`, now.toString());
    }
  };

  useEffect(() => {
    load(); // first load
    const id = setInterval(load, intervalMs);

    return () => clearInterval(id); // cleanup
  }, []);

  return data;
}

import { useEffect, useState } from "react";

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheMinutes = 60,
): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const now = Date.now();
    const cached = localStorage.getItem(key);
    const cachedTime = localStorage.getItem(`${key}_ts`);

    if (
      cached &&
      cachedTime &&
      now - parseInt(cachedTime) < cacheMinutes * 60 * 1000
    ) {
      try {
        setData(JSON.parse(cached));

        return;
      } catch {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_ts`);
      }
    }

    fetcher().then((res) => {
      setData(res);
      localStorage.setItem(key, JSON.stringify(res));
      localStorage.setItem(`${key}_ts`, now.toString());
    });
  }, [key, fetcher]);

  return data;
}

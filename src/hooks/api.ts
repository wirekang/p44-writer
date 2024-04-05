import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { P44Api } from "../api/p44-api.js";
import { useAtomValue } from "jotai";
import { p44ApiAtom } from "../atoms";

export function useApiQuery<T extends keyof P44Api>(
  method: T,
  args: any[],
): UseQueryResult<Awaited<ReturnType<P44Api[T]>>> {
  const api = useAtomValue(p44ApiAtom);

  const query = useQuery({
    queryKey: ["p44api", method, args],
    queryFn: () => {
      const f = api[method] as Function;
      return f.apply(api, args);
    },
  });

  return query;
}

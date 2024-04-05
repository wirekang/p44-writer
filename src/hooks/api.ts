import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { P44Api } from "../api/p44-api.js";
import { p44ApiAtom } from "../atoms";

export function useApiQuery<T extends keyof P44Api>(
  method: T,
  args: any[],
): UseSuspenseQueryResult<Awaited<ReturnType<P44Api[T]>>> {
  const api = useAtomValue(p44ApiAtom);

  const query = useSuspenseQuery({
    queryKey: ["p44api", method, args],
    queryFn: () => {
      const f = api[method] as Function;
      return f.apply(api, args);
    },
  });

  return query;
}

export function useApiMutation<T extends keyof P44Api>(method: T) {
  const api = useAtomValue(p44ApiAtom);
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: async (...args: any[]) => {
      const f = api[method] as Function;
      return f.apply(api, args);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: ["p44api"] });
    },
  });
  return m;
}

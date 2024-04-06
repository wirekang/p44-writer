import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { P44Api } from "../api/p44-api.js";
import { p44ApiAtom } from "../atoms";

export function useApiQuery<T extends keyof P44Api>(
  method: T,
  args: Parameters<P44Api[T]>,
  options?: { staleTime?: number },
): UseSuspenseQueryResult<Awaited<ReturnType<P44Api[T]>>> {
  const api = useAtomValue(p44ApiAtom);

  const query = useSuspenseQuery({
    ...options,
    queryKey: ["p44api", method, args],
    queryFn: () => {
      const f = api[method] as Function;
      if (!f) {
        throw new Error(`no method: ${method}`);
      }
      return f.apply(api, args);
    },
  });

  return query as any;
}

export function useApiMutation<T extends keyof P44Api>(
  method: T,
  options?: {
    invalidates?: (keyof P44Api)[];
  },
): UseMutationResult<
  Awaited<ReturnType<P44Api[T]>>,
  Error,
  Parameters<P44Api[T]>
> {
  const api = useAtomValue(p44ApiAtom);
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: async (args: any[]) => {
      const f = api[method] as Function;
      return f.apply(api, args);
    },
    onSuccess: () => {
      if (options?.invalidates) {
        options.invalidates.forEach((m) =>
          qc.invalidateQueries({ queryKey: ["p44api", m] }),
        );
      } else {
        qc.invalidateQueries({ queryKey: ["p44api"] });
      }
    },
  });
  return m as any;
}

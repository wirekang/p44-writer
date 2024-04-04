import { useQuery } from "@tanstack/react-query";
import { P44ApiImpl } from "../api/impl";

export function useQueryP44Api() {
  return useQuery({
    queryKey: ["p44api"],
    queryFn: async () => {
      const api = new P44ApiImpl(window.io);
      await api.init();
      return api;
    },
  });
}

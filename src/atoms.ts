import { atom } from "jotai";
import { P44ApiImpl } from "./api/impl";

export const p44ApiAtom = atom(async () => {
  const a = new P44ApiImpl(window.io);
  await a.init();
  return a;
});

import { useAtomValue } from "jotai";
import { languageAtom } from "../atoms";
import { useCallback } from "react";
import type { I18nText } from "p44-types";

export function useLanguageSelector() {
  const lang = useAtomValue(languageAtom);
  return useCallback(
    (v: I18nText) => {
      return v[lang];
    },
    [lang],
  );
}

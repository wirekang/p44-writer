import { useAtom } from "jotai";
import { languageAtom } from "../atoms";
import { useApiQuery } from "../hooks/api";
import { KeyboardButtonsView } from "./KeyboardButtonsView";

export function LanguageView() {
  const languages = useApiQuery("listLanguages", []).data;
  const [language, setLanguage] = useAtom(languageAtom);

  if (!languages) {
    return <>loading</>;
  }

  const buttons = languages.map((lang) => ({
    label: lang,
    cb: () => {
      setLanguage(lang);
    },
  }));
  return (
    <div>
      lang:{language}
      <KeyboardButtonsView buttons={buttons} />
    </div>
  );
}

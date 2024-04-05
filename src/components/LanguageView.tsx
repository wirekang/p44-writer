import { useAtom } from "jotai";
import { useApiQuery } from "../hooks/useApiQuery";
import { languageAtom } from "../atoms";

export function LanguageView() {
  const languages = useApiQuery("listLanguages", []).data ?? [];
  return (
    <div>
      <div>Languages: {languages.join()}</div>
      <SetView to="en" />
      {" <-> "}
      <SetView to="ko" />
    </div>
  );
}

function SetView(props: { to: string }) {
  const [language, setLanguage] = useAtom(languageAtom);
  return (
    <button
      type="button"
      onClick={() => {
        setLanguage(props.to);
      }}
      disabled={props.to === language}
    >
      {props.to}
    </button>
  );
}

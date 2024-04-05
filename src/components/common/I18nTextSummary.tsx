import type { I18nText } from "p44-types";
import type { CSSProperties } from "react";

export function I18nTextSummary(props: { style?: CSSProperties; v: I18nText }) {
  return (
    <div style={props.style}>
      {Object.entries(props.v).map(([lang, txt]) => (
        <div key={lang} style={{ display: "inline" }}>
          ({txt})
        </div>
      ))}
    </div>
  );
}

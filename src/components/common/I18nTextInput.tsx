import type { I18nText } from "p44-types";
import type { CSSProperties } from "react";

export function I18nTextInput(props: {
  containerStyle?: CSSProperties;
  wrapperStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  langStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  label?: string;
  v: I18nText;
  s: (v: I18nText) => unknown;
}) {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid grey",
        padding: 4,
        ...props.containerStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minWidth: "100px",
          marginRight: 4,
          ...props.labelStyle,
        }}
      >
        {props.label}
      </div>
      <div>
        {Object.entries(props.v).map(([lang, text]) => (
          <div key={lang} style={props.wrapperStyle}>
            <span style={props.langStyle}>{lang}:</span>
            <input
              style={{ width: 300, ...props.inputStyle }}
              value={text}
              onChange={(e) => {
                props.s({ ...props.v, [lang]: e.target.value });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

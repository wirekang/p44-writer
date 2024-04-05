import type { CSSProperties } from "react";

export function BoolInput(props: {
  label?: string;
  v: boolean;
  s: (v: boolean) => unknown;
  containerStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  inputStyle?: CSSProperties;
}) {
  return (
    <div
      style={{ border: "1px solid grey", padding: 4, ...props.containerStyle }}
    >
      {props.label && (
        <span
          style={{
            display: "inline-block",
            minWidth: 100,
            ...props.labelStyle,
          }}
        >
          {props.label}:
        </span>
      )}
      <input
        style={{ width: 60, ...props.inputStyle }}
        type="checkbox"
        checked={props.v}
        onChange={(e) => {
          props.s(e.target.checked);
        }}
      />
    </div>
  );
}

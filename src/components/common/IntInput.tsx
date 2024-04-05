import type { CSSProperties } from "react";

export function IntInput(props: {
  label?: string;
  v: number;
  s: (v: number) => unknown;
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
        type="number"
        value={props.v}
        onChange={(e) => {
          const n = parseInt(e.target.value);
          if (Number.isNaN(n)) {
            return;
          }
          props.s(n);
        }}
      />
    </div>
  );
}

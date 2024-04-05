import type { KeyEvent } from "../utils/keyboard-system";
import { KeyboardSystemView } from "./KeyboardSystemView";

export function KeyboardButtonsView(props: {
  buttons: { label: string; cb: () => unknown }[];
}) {
  const onKey = (e: KeyEvent) => {
    const n = parseInt(e.key);
    if (!Number.isInteger(n)) {
      return;
    }
    const b = props.buttons[n - 1];
    if (!b) {
      return;
    }
    b.cb();
  };

  return (
    <KeyboardSystemView onKey={onKey}>
      {props.buttons.map((b, i) => (
        <div key={i} style={{ display: "inline", marginRight: "4px" }}>
          [{i + 1}]:{b.label}
        </div>
      ))}
    </KeyboardSystemView>
  );
}

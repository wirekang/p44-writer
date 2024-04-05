import { useKeyboardSystem } from "../hooks/keyboard";
import type { KeyListener } from "../utils/keyboard-system";

export function KeyboardSystemView(props: {
  children: any;
  onKey?: KeyListener;
}) {
  const { ref, focused } = useKeyboardSystem({
    key: props.onKey,
  });

  return (
    <div
      ref={ref}
      style={{
        margin: "2px",
        border: focused ? "1px solid red" : "1px dashed #fbb",
      }}
    >
      {props.children}
    </div>
  );
}

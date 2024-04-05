import { useEffect, useRef, useState } from "react";
import { KeyboardSystemItem, type KeyListener } from "../utils/keyboard-system";

export function useKeyboardSystem(o: { key?: KeyListener }) {
  const ref = useRef<any>(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const detail: KeyboardSystemItem = {
      element: ref.current,
      keyListener: o.key ?? (() => {}),
      focusListener: setFocused,
    };
    const e = new CustomEvent<KeyboardSystemItem>("ks-register", { detail });
    window.dispatchEvent(e);
    return () => {
      const e = new CustomEvent<KeyboardSystemItem>("ks-unregister", {
        detail,
      });
      window.dispatchEvent(e);
    };
  }, [ref]);
  return { ref, focused };
}

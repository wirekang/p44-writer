declare global {
  interface WindowEventMap {
    "ks-register": CustomEvent<KeyboardSystemItem>;
    "ks-unregister": CustomEvent<KeyboardSystemItem>;
  }
}

export type KeyboardSystemItem = {
  element: Element;
  keyListener: KeyListener;
  focusListener: FocusListener;
};

export type KeyEvent = {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
};

export type KeyListener = (e: KeyEvent) => unknown;
export type FocusListener = (f: boolean) => unknown;

export function initKeyboardSystem() {
  console.log("keyboard system init");
  let focused: KeyboardSystemItem | null = null;
  let items: KeyboardSystemItem[] = [];

  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.key);
    if (focused) {
      if (e.key === "Escape") {
        focused.focusListener(false);
        focused = null;
        return;
      }

      if (e.altKey === true) {
        let i = items.indexOf(focused);
        switch (e.key) {
          case "j":
            i++;
            break;
          case "k":
            i--;
            break;
          case "h":
            i -= 5;
            break;
          case "l":
            i += 5;
            break;
        }
        if (i < 0) {
          i = 0;
        }
        if (i >= items.length) {
          i = items.length - 1;
        }
        focused.focusListener(false);
        focused = items[i];
        focused.focusListener(true);
      }
      focused.keyListener({
        alt: e.altKey,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        key: e.key,
      });
      return;
    }
    if (e.key === "f" && items.length > 0) {
      focused = items[0];
      focused.focusListener(true);
      return;
    }
  });

  window.addEventListener("ks-register", (e) => {
    items.push(e.detail);

    items.sort((a, b) => {
      return (
        a.element.getBoundingClientRect().top -
        b.element.getBoundingClientRect().top
      );
    });
  });

  window.addEventListener("ks-unregister", (e) => {
    items = items.filter((it) => it !== e.detail);
    if (focused === e.detail) {
      focused = null;
    }
  });
}

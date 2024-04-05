import { useEffect } from "react";

export function FocusManager(props: any) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {};

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return <>{props.children}</>;
}

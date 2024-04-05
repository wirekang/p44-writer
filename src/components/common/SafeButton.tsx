import { useState } from "react";

export function SafeButton(props: { onClick: () => unknown; children: any }) {
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    if (progress === 0) {
      const f = () => {
        setProgress((p) => p + 10);
        if (progress >= 100) {
          return;
        }
        setTimeout(f, 200);
      };
      f();
      return;
    }
    if (progress >= 100) {
      if (confirm("WARNING")) {
        props.onClick();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        border: progress >= 100 ? "" : "1px solid red",
        cursor: "pointer",
      }}
      disabled={progress < 100 && progress > 0}
    >
      {props.children}
    </button>
  );
}

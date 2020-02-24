import * as React from "react";

interface MousePosition {
  x: number;
  y: number;
}

export interface ContextMenuRef {
  show: (mousePosition: MousePosition, payload: React.ReactNode) => void;
  hide: () => void;
}

export interface ContextMenuWrapperProps {}

export const ContextMenuWrapper = React.forwardRef<
  ContextMenuRef,
  ContextMenuWrapperProps
>((_, ref) => {
  const [state, setState] = React.useState<{
    position: MousePosition | null;
    payload: React.ReactNode | null;
  }>({ position: null, payload: null });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRect = containerRef.current?.getBoundingClientRect();

  React.useImperativeHandle(ref, () => ({
    show: (mousePosition, clientPayload) => {
      setState({
        position: mousePosition,
        payload: clientPayload
      });
    },
    hide: () => {
      setState(prev => ({ ...prev, position: null }));
    }
  }));

  const handleClickOutside = e => {
    if (containerRef.current?.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setState(prev => ({ ...prev, position: null }));
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const style: React.CSSProperties = {
    position: "absolute",
    zIndex: 3000
  };

  if (state?.position && tooltipRect) {
    const { position } = state;

    const extra = 5;

    let x = position.x + window.scrollX + extra;
    let y = position.y + window.scrollY + extra;

    style.left = `${x}px`;
    style.top = `${y}px`;
  }

  style.visibility = !state?.position || !state.payload ? "hidden" : "visible";

  return (
    <div style={style} ref={containerRef}>
      {state.payload}
    </div>
  );
});

import * as React from "react";
import { useMeasure, useClickAway } from "react-use";

export interface MousePosition {
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
  const [containerRef, { width, height }] = useMeasure();
  const clickRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    show: (mousePosition, clientPayload) => {
      setState({
        position: mousePosition,
        payload: clientPayload,
      });
    },
    hide: () => {
      setState((prev) => ({ ...prev, position: null }));
    },
  }));

  useClickAway(clickRef, () => {
    setState((prev) => ({ ...prev, position: null }));
  });

  const style: React.CSSProperties = { position: "absolute", zIndex: 3000 };
  if (state?.position) {
    const { position } = state;
    let x = position.x + window.scrollX;
    let y = position.y + window.scrollY;
    const hasSpaceRight =
      x + width < window.scrollX + document.documentElement.clientWidth;
    const hasSpaceBottom =
      y + height < window.scrollY + document.documentElement.clientHeight;
    x -= !hasSpaceRight ? width : 0;
    y -= !hasSpaceBottom ? height : 0;

    style.left = `${x + 4}px`;
    style.top = `${y + 4}px`;
  }
  style.display = !state?.position || !state.payload ? "none" : "block";

  return (
    <div style={style} ref={containerRef}>
      <div ref={clickRef}>{state.payload}</div>
    </div>
  );
});

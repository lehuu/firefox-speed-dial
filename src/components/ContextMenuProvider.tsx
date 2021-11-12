import * as React from "react";
import { ContextMenuWrapper, ContextMenuRef } from "./ContextMenuWrapper";

export const ContextMenuContext = React.createContext<ContextMenuRef>({
  show: () => {},
  hide: () => {},
});

interface ContextMenuProviderProps {
  children: React.ReactNode;
}

export const ContextMenuProvider: React.FunctionComponent<ContextMenuProviderProps> =
  ({ children }) => {
    const ref = React.useRef<ContextMenuRef>(null);

    const show = (clientRect: DOMRect, payload: React.ReactNode) => {
      if (!ref.current) {
        return;
      }
      ref.current.show(clientRect, payload);
    };
    const hide = () => {
      if (!ref.current) {
        return;
      }
      ref.current.hide();
    };

    return (
      <ContextMenuContext.Provider value={{ show, hide }}>
        {children}
        <ContextMenuWrapper ref={ref} />
      </ContextMenuContext.Provider>
    );
  };

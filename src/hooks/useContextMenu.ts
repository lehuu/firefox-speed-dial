import * as React from "react";
import { ContextMenuContext } from "../components/ContextMenuProvider";

export default function useContextMenu() {
  return React.useContext(ContextMenuContext);
}

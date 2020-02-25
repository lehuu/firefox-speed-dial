import * as React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Tabs, Tab, withStyles } from "@material-ui/core";

const FullTabBar = withStyles({
  root: {
    width: "100%"
  }
})(Tabs);

export const SortableTab = SortableElement(
  ({ tempIndex, label, onChange, onContextMenu }) => {
    return (
      <Tab
        style={{ zIndex: 1200 }}
        onChange={onChange}
        value={tempIndex}
        label={label}
        onContextMenu={onContextMenu}
      />
    );
  }
);

export const SortableTabs = SortableContainer(
  ({ value, onChange, children }) => {
    return (
      <FullTabBar
        value={value}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs"
      >
        {children}
      </FullTabBar>
    );
  }
);

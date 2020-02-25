import * as React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Tabs, Tab } from "@material-ui/core";

export const SortableTab = SortableElement(
  ({ tempIndex, label, onChange, onContextMenu }) => {
    return (
      <Tab
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
      <Tabs
        value={value}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs"
      >
        {children}
      </Tabs>
    );
  }
);

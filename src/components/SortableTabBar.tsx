import * as React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Tabs, Tab } from "@mui/material";

const WrappedTab: React.FunctionComponent<React.ComponentProps<typeof Tab>> = (
  props
) => <Tab style={{ zIndex: 1200, minWidth: "160px" }} {...props} />;

export const SortableTab =
  SortableElement<React.ComponentProps<typeof Tab>>(WrappedTab);

const WrappedTabBar: React.FunctionComponent<
  React.ComponentProps<typeof Tabs>
> = (props) => (
  <Tabs
    sx={{
      width: "100%",
    }}
    {...props}
    indicatorColor="primary"
    textColor="primary"
    variant="scrollable"
    scrollButtons="auto"
    aria-label="scrollable auto tabs"
  />
);

export const SortableTabs =
  SortableContainer<React.ComponentProps<typeof Tabs>>(WrappedTabBar);

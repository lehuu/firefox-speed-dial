import * as React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Tabs, Box } from "@mui/material";

interface WrappedTabProps {
  label: string;
  value: number;
  onClick: (value: number) => void;
  onContextMenu: React.MouseEventHandler<HTMLDivElement>;
}

const WrappedTab: React.FunctionComponent<WrappedTabProps> = ({
  label,
  onClick,
  value,
  onContextMenu,
}) => (
  <Box
    tabIndex={value}
    role="tab"
    sx={{
      zIndex: 1200,
      minWidth: "160px",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      opacity: 0.7,
      userSelect: "none",
      textTransform: "capitalize",
      padding: "6px 12px",
      flex: "0 0 auto",
      textAlign: "center",
    }}
    onClick={() => {
      onClick(value);
    }}
    onContextMenu={onContextMenu}
  >
    {label}
  </Box>
);

export const SortableTab = SortableElement<WrappedTabProps>(WrappedTab);

const WrappedTabBar: React.FunctionComponent<
  React.ComponentProps<typeof Tabs>
> = (props) => (
  <Tabs
    sx={{
      width: "100%",
      "& .MuiTabs-flexContainer": {
        height: "100%",
      },
    }}
    {...props}
    indicatorColor="primary"
    textColor="primary"
    variant="scrollable"
    scrollButtons="auto"
    aria-label="scrollable auto tabs"
  />
);

export const SortableTabbar =
  SortableContainer<React.ComponentProps<typeof Tabs>>(WrappedTabBar);

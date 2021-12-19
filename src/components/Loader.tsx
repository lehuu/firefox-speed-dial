import * as React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface LoaderProps {
  open: boolean;
}

export const Loader: React.FunctionComponent<LoaderProps> = ({ open }) => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.appBar - 50,
        color: "#fff",
      }}
      open={open}
    >
      <CircularProgress size={100} color="inherit" />
    </Backdrop>
  );
};

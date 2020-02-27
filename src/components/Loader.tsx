import * as React from "react";
import { makeStyles, Backdrop, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.appBar - 50,
    color: "#fff"
  }
}));

interface LoaderProps {
  open: boolean;
}

export const Loader: React.SFC<LoaderProps> = ({ open }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress size={100} color="inherit" />
    </Backdrop>
  );
};

import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { red } from "@mui/material/colors";

export interface DialogTitleProps
  extends React.ComponentProps<typeof DialogTitle> {
  id: string;
  onClose: () => void;
}

const StyledDialogTitle: React.FunctionComponent<DialogTitleProps> = ({
  children,
  onClose,
  ...other
}) => {
  return (
    <DialogTitle
      sx={{
        margin: 0,
        padding: (theme) => theme.spacing(2),
      }}
      {...other}
    >
      <Typography variant="span">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: (theme) => theme.spacing(1),
            top: (theme) => theme.spacing(1),
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export const StyledDialogContent: React.FunctionComponent<
  React.ComponentProps<typeof DialogContent>
> = (props) => (
  <DialogContent
    dividers
    sx={{
      padding: (theme) => theme.spacing(2),
    }}
    {...props}
  />
);

export const StyledDialogActions: React.FunctionComponent<
  React.ComponentProps<typeof DialogActions>
> = (props) => (
  <DialogActions
    sx={{
      margin: 0,
      padding: (theme) => theme.spacing(1),
    }}
    {...props}
  />
);

export const RedButton: React.FunctionComponent<
  React.ComponentProps<typeof Button>
> = (props) => (
  <Button
    sx={{
      color: red[600],
      "&:hover": { color: red[800] },
    }}
    {...props}
  />
);

export interface PopUpProps {
  heading: string;
  open: boolean;
  onClose: () => void;
  onKeyEnter?: () => void;
}

const PopUp: React.FunctionComponent<PopUpProps> = ({
  heading,
  children,
  open,
  onClose,
  onKeyEnter,
}) => {
  const handleOnKeyEnter = (e: React.KeyboardEvent) => {
    if (!onKeyEnter) {
      return;
    } else if (e.keyCode === 13) {
      onKeyEnter();
    }
  };

  return (
    <Dialog
      fullWidth={true}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      onKeyUp={handleOnKeyEnter}
    >
      <StyledDialogTitle id="customized-dialog-title" onClose={onClose}>
        {heading}
      </StyledDialogTitle>
      {children}
    </Dialog>
  );
};

export default PopUp;

import * as React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const ErrorMessage = withStyles((theme: Theme) => ({
  root: {
    color: red[600],
    position: "absolute",
    left: theme.spacing(1)
  }
}))(Typography);

const DeleteButton = withStyles({
  root: {
    color: red[600],
    "&:hover": { color: red[800] }
  }
})(Button);

export interface PopUpProps {
  heading: string;
  open: boolean;
  error?: string;
  onClose: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  children?: any;
}

const PopUp: React.SFC<PopUpProps> = ({
  heading,
  children,
  open,
  onClose,
  onSave,
  onDelete,
  error
}) => {
  return (
    <Dialog
      fullWidth={true}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {heading}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {onDelete && (
          <DeleteButton onClick={onDelete} color="primary">
            Delete
          </DeleteButton>
        )}

        {onSave && (
          <Button onClick={onSave} color="primary">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PopUp;
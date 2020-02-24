import * as React from "react";
import PopUp, {
  PopUpProps,
  RedButton,
  DialogContent,
  DialogActions
} from "./popup";
import { Button, Typography } from "@material-ui/core";

interface ConfirmPopupProps extends Omit<PopUpProps, "children"> {
  onConfirm: () => void;
  onDeny: () => void;
  body: string;
}

const ConfirmPopup: React.SFC<ConfirmPopupProps> = ({
  heading,
  body,
  onClose,
  open,
  onConfirm,
  onDeny
}) => {
  return (
    <PopUp heading={heading} onClose={onClose} open={open}>
      <DialogContent>
        <Typography>{body}</Typography>
      </DialogContent>
      <DialogActions>
        <RedButton onClick={onDeny}>No</RedButton>
        <Button onClick={onConfirm} color="primary">
          Yes
        </Button>
      </DialogActions>
    </PopUp>
  );
};

export default ConfirmPopup;

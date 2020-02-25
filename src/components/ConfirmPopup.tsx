import * as React from "react";
import PopUp, {
  PopUpProps,
  RedButton,
  DialogContent,
  DialogActions
} from "./Popup";
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
  const ref = React.createRef<HTMLButtonElement>();
  ref.current?.focus();

  return (
    <PopUp
      heading={heading}
      onKeyEnter={onConfirm}
      onClose={onClose}
      open={open}
    >
      <DialogContent>
        <Typography>{body}</Typography>
      </DialogContent>
      <DialogActions>
        <RedButton onClick={onDeny}>No</RedButton>
        <Button ref={ref} onClick={onConfirm} color="primary">
          Yes
        </Button>
      </DialogActions>
    </PopUp>
  );
};

export default ConfirmPopup;

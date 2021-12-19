import * as React from "react";
import PopUp, {
  PopUpProps,
  RedButton,
  StyledDialogContent,
  StyledDialogActions,
} from "./Popup";
import { Button, Typography } from "@mui/material";

interface ConfirmPopupProps extends Omit<PopUpProps, "children"> {
  onConfirm: () => void;
  onDeny: () => void;
  body: string;
}

const ConfirmPopup: React.FunctionComponent<ConfirmPopupProps> = ({
  heading,
  body,
  onClose,
  open,
  onConfirm,
  onDeny,
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
      <StyledDialogContent>
        <Typography>{body}</Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <RedButton onClick={onDeny}>No</RedButton>
        <Button ref={ref} onClick={onConfirm} color="primary">
          Yes
        </Button>
      </StyledDialogActions>
    </PopUp>
  );
};

export default ConfirmPopup;

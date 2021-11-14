import * as React from "react";
import { useForm } from "react-hook-form";
import PopUp, {
  PopUpProps,
  RedButton,
  StyledDialogContent,
  StyledDialogActions,
} from "./Popup";
import { Button, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { Group } from "../types";
import createGroup from "../mutations/createGroup";
import updateGroup from "../mutations/updateGroup";
import deleteGroup from "../mutations/deleteGroup";

type FormData = {
  title: string;
};

interface GroupPopUpProps extends Omit<PopUpProps, "children"> {
  group?: Group;
  onSave: () => void;
}

const GroupPopUp: React.FunctionComponent<GroupPopUpProps> = ({
  heading,
  onClose,
  onSave,
  open,
  group,
}) => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (!group) {
      return;
    }
    const result = await deleteGroup(group);
    if (result.error) {
      enqueueSnackbar(`Error deleting group: ${result.error.name}`, {
        variant: "error",
      });
      return;
    }
    enqueueSnackbar("Group deleted", { variant: "success" });
    onClose();
    onSave();
  };
  const handleSave = async (data: FormData) => {
    const result = !group
      ? await createGroup(data.title)
      : await updateGroup({ ...group, title: data.title });
    if (result.error) {
      enqueueSnackbar(`Error saving group: ${result.error.name}`, {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Group saved", { variant: "success" });
      onClose();
      onSave();
    }
  };

  return (
    <PopUp heading={heading} onClose={onClose} open={open}>
      <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
        <StyledDialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!!errors.title}
            helperText={errors.title && errors.title.message}
            name="title"
            inputRef={register({
              required: "Title is required",
            })}
            defaultValue={group?.title || ""}
            id="standard-basic"
            variant="outlined"
            label="Title"
          />
        </StyledDialogContent>
        <StyledDialogActions>
          {group && <RedButton onClick={handleDelete}>Delete</RedButton>}
          <Button type="submit" color="primary">
            Save
          </Button>
        </StyledDialogActions>
      </form>
    </PopUp>
  );
};

export default GroupPopUp;

import * as React from "react";
import { useForm } from "react-hook-form";
import PopUp, {
  PopUpProps,
  RedButton,
  DialogContent,
  DialogActions
} from "./popup";
import { Group } from "../hooks/useGroups";
import TextField from "@material-ui/core/TextField";
import useGroupMutation from "../hooks/useGroupMutation";
import { Button } from "@material-ui/core";
import { useSnackbar } from "notistack";

type FormData = {
  title: string;
};

interface GroupPopUpProps extends Omit<PopUpProps, "children"> {
  group?: Group;
  onSave: () => void;
}

const GroupPopUp: React.SFC<GroupPopUpProps> = ({
  heading,
  onClose,
  onSave,
  open,
  group
}) => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const {
    updateGroup,
    createGroup,
    isLoading,
    called,
    error: mutationError
  } = useGroupMutation();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (!isLoading && called && !mutationError) {
      enqueueSnackbar("Group saved", { variant: "success" });
      onClose();
      onSave();
    }
  }, [isLoading, called, mutationError]);

  React.useEffect(() => {
    if (!mutationError) {
      return;
    }
    enqueueSnackbar(`Error saving group: ${mutationError.name}`, {
      variant: "error"
    });
  }, [mutationError]);

  const handleDelete = group ? () => {} : null;
  const handleSave = (data: FormData) => {
    if (!group) {
      createGroup(data.title);
    } else {
      updateGroup({ ...group, title: data.title });
    }
  };

  return (
    <PopUp heading={heading} onClose={onClose} open={open}>
      <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!!errors.title}
            helperText={errors.title && errors.title.message}
            name="title"
            inputRef={register({
              required: "Title is required"
            })}
            defaultValue={group?.title || ""}
            id="standard-basic"
            variant="outlined"
            label="Title"
          />
        </DialogContent>
        <DialogActions>
          {group && <RedButton onClick={handleDelete}>Delete</RedButton>}
          <Button disabled={isLoading} type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </PopUp>
  );
};

export default GroupPopUp;

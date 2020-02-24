import * as React from "react";
import { useForm } from "react-hook-form";
import PopUp, {
  PopUpProps,
  ErrorMessage,
  RedButton,
  DialogContent,
  DialogActions
} from "./popup";
import { Group } from "../hooks/useGroups";
import TextField from "@material-ui/core/TextField";
import useGroupMutation from "../hooks/useGroupMutation";
import { Button } from "@material-ui/core";

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

  React.useEffect(() => {
    if (!isLoading && called && !mutationError) {
      onClose();
      onSave();
    }
  }, [isLoading, called, mutationError]);

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
          {mutationError?.name && (
            <ErrorMessage>{mutationError?.name}</ErrorMessage>
          )}
          {group && <RedButton onClick={handleDelete}>Delete</RedButton>}
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </PopUp>
  );
};

export default GroupPopUp;

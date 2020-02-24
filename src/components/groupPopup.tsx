import * as React from "react";
import { useForm } from "react-hook-form";
import PopUp, { PopUpProps } from "./popup";
import { Group } from "../hooks/useGroups";
import TextField from "@material-ui/core/TextField";
import useGroupMutation from "../hooks/useGroupMutation";

type FormData = {
  title: string;
};

interface GroupPopUp extends Omit<PopUpProps, "children"> {
  group?: Group;
  onSave: () => void;
}

const GroupPopUp: React.SFC<GroupPopUp> = ({
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
    <PopUp
      heading={heading}
      onClose={onClose}
      open={open}
      onDelete={handleDelete}
      onSave={handleSubmit(handleSave)}
      error={mutationError?.name}
    >
      <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
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
      </form>
    </PopUp>
  );
};

export default GroupPopUp;

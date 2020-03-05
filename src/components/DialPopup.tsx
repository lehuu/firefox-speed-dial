import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import PopUp, {
  PopUpProps,
  RedButton,
  DialogContent,
  DialogActions
} from "./Popup";
import TextField from "@material-ui/core/TextField";
import { Button, makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { Dial } from "../types";
import createDial from "../mutations/createDial";
import updateDial from "../mutations/updateDial";
import deleteDial from "../mutations/deleteDial";
import ColorPicker from "./ColorPicker";
import parseLink from "../utils/parseLink";
import getRandomColor from "../utils/getRandomColor";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(2)
    }
  }
}));

type FormData = {
  link: string;
  alias?: string;
  color: string;
};

interface DialPopUpProps extends Omit<PopUpProps, "children"> {
  dial?: Dial;
  groupId: string;
  onSave: () => void;
}

const DialPopUp: React.SFC<DialPopUpProps> = ({
  heading,
  onClose,
  onSave,
  groupId,
  open,
  dial
}) => {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    errors,
    control,
    getValues,
    setValue
  } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (!dial) {
      return;
    }
    const result = await deleteDial(dial);
    if (result.error) {
      enqueueSnackbar(`Error deleting dial: ${result.error.name}`, {
        variant: "error"
      });
      return;
    }
    enqueueSnackbar("Dial deleted", { variant: "success" });
    onClose();
    onSave();
  };

  const handleBlurLink = () => {
    const { link, alias } = getValues();
    if (alias) {
      return;
    }
    const url = link;
    const parsedAlias = parseLink(url);
    setValue("alias", parsedAlias);
  };

  const handleSave = async (data: FormData) => {
    let { link, alias, color } = data;
    alias = alias ? alias : link;

    const result = !dial
      ? await createDial(link, alias, color, groupId)
      : await updateDial({ ...dial, link: link, alias: alias, color });

    if (result.error) {
      enqueueSnackbar(`Error saving dial: ${result.error.name}`, {
        variant: "error"
      });
    } else {
      enqueueSnackbar("Dial saved", { variant: "success" });
      onClose();
      onSave();
    }
  };

  return (
    <PopUp heading={heading} onClose={onClose} open={open}>
      <form
        className={classes.root}
        autoComplete="off"
        onSubmit={handleSubmit(handleSave)}
      >
        <DialogContent>
          <Controller
            as={
              <TextField
                autoFocus
                variant="outlined"
                error={!!errors.link}
                helperText={errors.link && errors.link.message}
                label="Link"
                fullWidth
                onBlur={handleBlurLink}
              />
            }
            rules={{
              required: "Link is required"
            }}
            name="link"
            control={control}
            defaultValue={dial?.link || ""}
            onChange={([event]) => {
              return { value: event.target.value };
            }}
          />
          <Controller
            as={<TextField variant="outlined" label="Alias" fullWidth />}
            name="alias"
            control={control}
            defaultValue={dial?.alias || ""}
            onChange={([event]) => {
              return { value: event.target.value };
            }}
          />
          <Controller
            as={ColorPicker}
            control={control}
            onChange={([newValue]) => {
              return { value: newValue };
            }}
            name="color"
            defaultValue={dial ? dial.color : getRandomColor()}
          />
        </DialogContent>
        <DialogActions>
          {dial && <RedButton onClick={handleDelete}>Delete</RedButton>}
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </PopUp>
  );
};

export default DialPopUp;

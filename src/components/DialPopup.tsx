import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import PopUp, {
  PopUpProps,
  RedButton,
  StyledDialogContent,
  StyledDialogActions,
} from "./Popup";
import { TextField, Button, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { Dial } from "../types";
import createDial from "../mutations/createDial";
import updateDial from "../mutations/updateDial";
import deleteDial from "../mutations/deleteDial";
import ColorPicker from "./ColorPicker";
import parseLink from "../utils/parseLink";
import getRandomColor from "../utils/getRandomColor";

type FormData = {
  link: string;
  alias?: string;
  color: string;
};

interface DialPopUpProps extends Omit<PopUpProps, "children"> {
  dial?: Dial;
  groupId: string;
  onSave?: () => void;
}

const DialPopUp: React.FunctionComponent<DialPopUpProps> = ({
  heading,
  onClose,
  onSave,
  groupId,
  open,
  dial,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (!dial) {
      return;
    }
    const result = await deleteDial(dial);
    if (result.error) {
      enqueueSnackbar(`Error deleting dial: ${result.error.name}`, {
        variant: "error",
      });
      console.error(result.error);
      return;
    }
    enqueueSnackbar("Dial deleted", { variant: "success" });
    onClose();
    onSave && onSave();
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
        variant: "error",
      });
      console.error(result.error);
    } else {
      enqueueSnackbar("Dial saved", { variant: "success" });
      onClose();
      onSave && onSave();
    }
  };

  return (
    <PopUp heading={heading} onClose={onClose} open={open}>
      <Box
        sx={{
          "& .MuiTextField-root": {
            marginBottom: (theme) => theme.spacing(2),
          },
        }}
      >
        <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
          <StyledDialogContent>
            <TextField
              {...register("link", { required: "Link is required" })}
              autoFocus
              variant="outlined"
              error={!!errors.link}
              helperText={errors.link && errors.link.message}
              label="Link"
              fullWidth
              defaultValue={dial?.link || ""}
              onBlur={handleBlurLink}
            />

            <TextField
              {...register("alias")}
              variant="outlined"
              label="Alias"
              fullWidth
              defaultValue={dial?.alias || ""}
            />

            <Controller
              render={({ field: { onChange, value } }) => (
                <ColorPicker
                  onChange={(newValue) => {
                    onChange(newValue);
                  }}
                  value={value}
                />
              )}
              control={control}
              name="color"
              defaultValue={dial?.color ?? getRandomColor()}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            {dial && <RedButton onClick={handleDelete}>Delete</RedButton>}
            <Button type="submit" color="primary">
              Save
            </Button>
          </StyledDialogActions>
        </form>
      </Box>
    </PopUp>
  );
};

export default DialPopUp;

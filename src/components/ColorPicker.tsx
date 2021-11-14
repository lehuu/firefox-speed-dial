import * as React from "react";

import { ColorResult, SwatchesPicker } from "react-color";
import { Box, Popover, Theme } from "@mui/material";

interface ColorPickerProps {
  value: string;
  onChange?: (newValue: string) => void;
}

const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({
  value,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (color: ColorResult) => {
    if (!onChange) {
      return;
    }
    onChange(color.hex);
  };

  return (
    <div>
      <Box
        sx={{
          padding: (theme: Theme) => theme.spacing(1),
          borderRadius: (theme: Theme) => theme.shape.borderRadius,
          borderWidth: "1px",
          borderColor: (theme: Theme) => theme.palette.text.disabled,
          borderStyle: "solid",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            width: "36px",
            height: "14px",
            borderRadius: (theme: Theme) => theme.shape.borderRadius,
            backgroundColor: value,
          }}
        />
      </Box>

      <Popover
        sx={{
          marginTop: (theme: Theme) => theme.spacing(1),
          "& .swatches-picker": {
            height: "unset !important",

            "&> div > div": {
              background: "#212121 !important",
            },
          },
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <SwatchesPicker width={290} color={value} onChange={handleChange} />
      </Popover>
    </div>
  );
};

export default ColorPicker;

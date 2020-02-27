import * as React from "react";

import { ChromePicker, ColorResult, SwatchesPicker } from "react-color";
import { makeStyles, Popover } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  swatch: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderWidth: "1px",
    borderColor: theme.palette.text.disabled,
    borderStyle: "solid",
    display: "inline-block",
    cursor: "pointer"
  },
  color: (props: { backgroundColor: string }) => ({
    width: "36px",
    height: "14px",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: props.backgroundColor
  }),
  popover: {
    marginTop: theme.spacing(1)
  }
}));

interface ColorPickerProps {
  value: string;
  onChange?: (newValue: string) => void;
}

const ColorPicker: React.SFC<ColorPickerProps> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles({ backgroundColor: value });

  const handleClick = event => {
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
      <div className={classes.swatch} onClick={handleClick}>
        <div className={classes.color} />
      </div>
      <Popover
        className={classes.popover}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <SwatchesPicker color={value} onChange={handleChange} />
      </Popover>
    </div>
  );
};

export default ColorPicker;

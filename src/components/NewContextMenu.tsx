import * as React from "react";
import {
  Paper,
  ListItemIcon,
  withStyles,
  MenuItem,
  ListItemText,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

interface NewContextMenuProps {
  onNew: () => void;
  text: string;
}

const NewContextMenu: React.FunctionComponent<NewContextMenuProps> = ({
  onNew,
  text,
}) => {
  return (
    <Paper>
      <StyledMenuItem onClick={onNew}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={text} />
      </StyledMenuItem>
    </Paper>
  );
};

export default NewContextMenu;

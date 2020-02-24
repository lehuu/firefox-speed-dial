import * as React from "react";
import {
  Paper,
  ListItemIcon,
  withStyles,
  MenuItem,
  ListItemText
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

interface ContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ContextMenu: React.SFC<ContextMenuProps> = ({ onEdit, onDelete }) => {
  return (
    <Paper>
      <StyledMenuItem onClick={onEdit}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </StyledMenuItem>
      <StyledMenuItem onClick={onDelete}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </StyledMenuItem>
    </Paper>
  );
};

export default ContextMenu;
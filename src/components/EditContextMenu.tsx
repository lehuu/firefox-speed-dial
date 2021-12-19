import * as React from "react";
import { Paper, ListItemIcon, MenuItem, ListItemText } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const StyledMenuItem: React.FunctionComponent<
  React.ComponentProps<typeof MenuItem>
> = (props) => (
  <MenuItem
    {...props}
    sx={{
      "&:focus": {
        backgroundColor: (theme) => theme.palette.primary.main,
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: (theme) => theme.palette.common.white,
        },
      },
    }}
  />
);

interface EditContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EditContextMenu: React.FunctionComponent<EditContextMenuProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <Paper>
      <StyledMenuItem onClick={onEdit}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </StyledMenuItem>
      <StyledMenuItem onClick={onDelete}>
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </StyledMenuItem>
    </Paper>
  );
};

export default EditContextMenu;

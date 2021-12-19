import * as React from "react";
import { Paper, ListItemIcon, MenuItem, ListItemText } from "@mui/material";
import { Add } from "@mui/icons-material";

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
      <MenuItem
        sx={{
          "&:focus": {
            backgroundColor: (theme) => theme.palette.primary.main,
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
              color: (theme) => theme.palette.common.white,
            },
          },
        }}
        onClick={onNew}
      >
        <ListItemIcon>
          <Add fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={text} />
      </MenuItem>
    </Paper>
  );
};

export default NewContextMenu;

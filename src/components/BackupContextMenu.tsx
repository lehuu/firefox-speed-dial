import * as React from "react";
import { Paper, ListItemIcon, MenuItem, ListItemText } from "@mui/material";
import { CloudUpload, CloudDownload } from "@mui/icons-material";

interface BackupContextMenuProps {}

const BackupContextMenu: React.FunctionComponent<BackupContextMenuProps> =
  ({}) => {
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
        >
          <ListItemIcon>
            <CloudDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={"Backup Dials"} />
        </MenuItem>
        <MenuItem
          sx={{
            "&:focus": {
              backgroundColor: (theme) => theme.palette.primary.main,
              "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: (theme) => theme.palette.common.white,
              },
            },
          }}
        >
          <ListItemIcon>
            <CloudUpload fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={"Restore Dials"} />
        </MenuItem>
      </Paper>
    );
  };

export default BackupContextMenu;

import * as React from "react";
import {
  Paper,
  ListItemIcon,
  MenuItem,
  ListItemText,
  Link,
} from "@mui/material";
import { CloudUpload, CloudDownload } from "@mui/icons-material";
import useContextMenu from "../hooks/useContextMenu";
import useSyncStorage from "../hooks/useSyncStorage";

interface BackupContextMenuProps {}

const BackupContextMenu: React.FunctionComponent<BackupContextMenuProps> =
  () => {
    const { hide } = useContextMenu();
    const { data } = useSyncStorage();

    const downloadString = React.useMemo(() => {
      return `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
      )}`;
    }, [data]);

    const handleBackupClick = () => {
      hide();
    };

    const handleRestoreClick = () => {
      hide();
    };

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
          onClick={handleBackupClick}
        >
          <Link
            href={downloadString}
            download="speed-dial.json"
            sx={{
              color: "inherit",
              display: "inherit",

              "&:hover": {
                textDecoration: "inherit",
              },
            }}
          >
            <ListItemIcon>
              <CloudDownload fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={"Backup Dials"} />
          </Link>
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
          onClick={handleRestoreClick}
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

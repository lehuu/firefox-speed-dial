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
import { isStorageContentSchema } from "../types";
import createAll from "../mutations/createAll";
import { useSnackbar } from "notistack";

interface BackupContextMenuProps {}

const BackupContextMenu: React.FunctionComponent<BackupContextMenuProps> =
  () => {
    const inputFileRef = React.useRef<HTMLInputElement>(null);
    const { hide } = useContextMenu();
    const { data } = useSyncStorage();
    const { enqueueSnackbar } = useSnackbar();

    const downloadString = React.useMemo(() => {
      return `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
      )}`;
    }, [data]);

    const handleBackupClick = () => {
      hide();
    };

    const handleRestoreClick = () => {
      inputFileRef.current?.click();
      hide();
    };

    const handleFileSelect = () => {
      const fileList = inputFileRef.current?.files;
      if (fileList && fileList[0]) {
        var reader = new FileReader();
        reader.readAsText(fileList[0], "UTF-8");
        reader.onload = async (event) => {
          const result = event.target?.result;
          if (!result || typeof result !== "string") {
            enqueueSnackbar("Error reading file content", { variant: "error" });
            return;
          }

          const resultParsed = JSON.parse(result);
          if (isStorageContentSchema(resultParsed)) {
            const result = await createAll(resultParsed);
            if (result.error) {
              enqueueSnackbar(`${result.error.name} Error writing file`, {
                variant: "error",
              });
            }
          } else {
            enqueueSnackbar("File has an invalid structure", {
              variant: "error",
            });
          }
        };
        reader.onerror = () => {
          enqueueSnackbar("Error reading file", { variant: "error" });
        };
      }
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
        <input
          onChange={handleFileSelect}
          type="file"
          accept=".json"
          ref={inputFileRef}
          style={{ display: "none" }}
        />
      </Paper>
    );
  };

export default BackupContextMenu;

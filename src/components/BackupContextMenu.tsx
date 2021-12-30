import * as React from "react";
import {
  Paper,
  ListItemIcon,
  MenuItem,
  ListItemText,
  Link,
} from "@mui/material";
import { FileUpload, Download } from "@mui/icons-material";
import useContextMenu from "../hooks/useContextMenu";
import useSyncStorage from "../hooks/useSyncStorage";
import useSyncStorageSize from "../hooks/useSyncStorageSize";
import { isStorageContentSchema, MAXIMUM_STORAGE_TOTAL_SIZE } from "../types";
import createAll from "../mutations/createAll";
import { useSnackbar } from "notistack";

interface BackupContextMenuProps {}

const BackupContextMenu: React.FunctionComponent<BackupContextMenuProps> =
  () => {
    const inputFileRef = React.useRef<HTMLInputElement>(null);
    const { hide } = useContextMenu();
    const { data } = useSyncStorage();
    const {
      data: { size: totalSize },
    } = useSyncStorageSize();
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
              enqueueSnackbar("Error writing file", {
                variant: "error",
              });
              console.error(result.error.message);
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
              display: "flex",
              alignItems: "center",

              "&:hover": {
                textDecoration: "inherit",
              },
            }}
          >
            <ListItemIcon>
              <Download fontSize="small" />
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
            <FileUpload fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={"Restore Dials"} />
          <input
            onChange={handleFileSelect}
            type="file"
            accept=".json"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
        </MenuItem>
        <MenuItem>
          {Math.ceil(totalSize / MAXIMUM_STORAGE_TOTAL_SIZE)}% space filled
        </MenuItem>
      </Paper>
    );
  };

export default BackupContextMenu;

import { Box, Button, Link } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import useSyncStorage from "../hooks/useSyncStorage";
import createAll from "../mutations/createAll";

const ErrorHandler: React.FunctionComponent = () => {
  const { data } = useSyncStorage();
  const { enqueueSnackbar } = useSnackbar();

  const handleDialRemoval = async () => {
    const result = await createAll({ groups: [], dials: [] });
    if (result.error) {
      enqueueSnackbar(`${result.error.name} Error writing file`, {
        variant: "error",
      });
      return;
    }
    window.location.reload();
  };

  const downloadString = React.useMemo(() => {
    return `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
  }, [data]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h2>An error occurred</h2>
      <Button variant="contained" sx={{ padding: "0" }}>
        <Link
          sx={{
            color: "inherit",
            textDecoration: "inherit",
            padding: "6px 16px",

            "&:hover": {
              textDecoration: "inherit",
            },
          }}
          variant="button"
          href={downloadString}
          download="speed-dial.json"
        >
          Backup Dials
        </Link>
      </Button>
      <Button variant="contained" color="error" onClick={handleDialRemoval}>
        Remove all dials
      </Button>
    </Box>
  );
};

export default ErrorHandler;

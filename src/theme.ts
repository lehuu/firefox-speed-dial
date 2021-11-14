import { blue } from "@mui/material/colors";
import { createTheme } from "@mui/material";

const Theme = createTheme({
  palette: {
    primary: blue,
    mode: "dark",
    background: {
      default: "#303030",
    },
  },
});

export default Theme;

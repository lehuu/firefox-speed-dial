import { blue, grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: blue,
    secondary: grey,
    mode: "dark",
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#212121",
        },
      },
    },
  },
});

export default Theme;

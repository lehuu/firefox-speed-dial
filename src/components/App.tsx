import * as React from "react";
import Theme from "../theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ContextMenuProvider } from "./ContextMenuProvider";
import Content from "./Content";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/system";

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={4}>
        <ContextMenuProvider>
          <Content />
        </ContextMenuProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;

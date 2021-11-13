import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../theme";
import { CssBaseline } from "@material-ui/core";
import { ContextMenuProvider } from "./ContextMenuProvider";
import Content from "./Content";
import { SnackbarProvider } from "notistack";

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={theme}>
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

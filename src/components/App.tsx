import * as React from "react";
import Theme from "../theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ContextMenuProvider } from "./ContextMenuProvider";
import Content from "./Content";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import ErrorBoundary from "./ErrorBoundary";

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={4}>
        <ContextMenuProvider>
          <ErrorBoundary>
            <Content />
          </ErrorBoundary>
        </ContextMenuProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;

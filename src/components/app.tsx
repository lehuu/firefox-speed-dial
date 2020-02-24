import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../theme";
import { CssBaseline } from "@material-ui/core";
import { ContextMenuProvider } from "./ContextMenuProvider";
import Content from "./content";

const App: React.SFC<any> = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContextMenuProvider>
        <Content />
      </ContextMenuProvider>
    </ThemeProvider>
  );
};

export default App;

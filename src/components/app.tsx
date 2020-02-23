import * as React from "react";
import useGroups from "../hooks/useGroups";
import GroupPopUp from "./groupPopup";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../theme";
import {
  CssBaseline,
  AppBar,
  Tabs,
  Tab,
  Button,
  IconButton,
  withStyles
} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";

const CreateGroupButton = withStyles({
  root: {
    float: "right"
  }
})(IconButton);

function a11yProps(index: number) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const App: React.SFC<any> = () => {
  const { groups, isLoading, error, refetch } = useGroups();
  const [isModalShown, setIsModalShown] = React.useState(false);

  React.useMemo(() => {
    groups.sort((a, b) => a.position - b.position);
  }, [groups]);

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (error) {
    return <div>Error loading groups</div>;
  }

  // if (isLoading) {
  //   return <div>Loading</div>;
  // }
  const handleShowModal = () => {
    setIsModalShown(true);
  };

  const handleCloseModal = () => {
    setIsModalShown(false);
  };

  const handleSave = () => {
    refetch();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
        >
          {groups.map((group, i) => (
            <Tab key={group.id} label={group.title} {...a11yProps(i)} />
          ))}
        </Tabs>
      </AppBar>

      <CreateGroupButton onClick={handleShowModal} color="primary">
        <AddCircle fontSize="large" />
      </CreateGroupButton>
      <GroupPopUp
        onSave={handleSave}
        heading="Create new group"
        open={isModalShown}
        onClose={handleCloseModal}
      />
    </ThemeProvider>
  );
};

export default App;

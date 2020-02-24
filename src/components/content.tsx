import * as React from "react";
import useGroups, { Group } from "../hooks/useGroups";
import GroupPopUp from "./groupPopup";
import { AppBar, Tabs, IconButton, withStyles, Tab } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "./ContextMenu";

const FlexAppBar = withStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
})(AppBar);

const CreateGroupButton = withStyles({
  root: {
    float: "right"
  }
})(IconButton);

const Content: React.SFC<any> = () => {
  const { groups, isLoading, error, refetch } = useGroups();
  const [modalState, setModalState] = React.useState<{
    isModalVisible: boolean;
    selectedGroup?: Group;
  }>({ isModalVisible: false });
  const { show, hide } = useContextMenu();

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
    setModalState({ isModalVisible: true });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isModalVisible: false }));
  };

  const handleSave = () => {
    refetch();
  };

  const handleEdit = (group: Group) => {
    setModalState({ selectedGroup: group, isModalVisible: true });
    hide();
  };

  const handleDelete = (group: Group) => {
    hide();
  };

  const handleRightClick = (
    event: React.MouseEvent<HTMLElement>,
    group: Group
  ) => {
    event.preventDefault();
    show(
      { x: event.clientX, y: event.clientY },
      <ContextMenu
        onEdit={() => handleEdit(group)}
        onDelete={() => handleDelete(group)}
      />
    );
  };

  return (
    <>
      <FlexAppBar position="static" color="default">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
        >
          {groups.map(group => (
            <Tab
              onContextMenu={e => handleRightClick(e, group)}
              key={group.id}
              label={group.title}
            ></Tab>
          ))}
        </Tabs>
        <CreateGroupButton onClick={handleShowModal} color="primary">
          <AddCircle fontSize="default" />
        </CreateGroupButton>
      </FlexAppBar>

      <GroupPopUp
        onSave={handleSave}
        heading={modalState.selectedGroup ? "Edit group" : "Create new group"}
        group={modalState.selectedGroup}
        open={modalState.isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Content;

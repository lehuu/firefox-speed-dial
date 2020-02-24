import * as React from "react";
import useGroups, { Group } from "../hooks/useGroups";
import GroupPopUp from "./groupPopup";
import { AppBar, Tabs, IconButton, withStyles, Tab } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "./ContextMenu";
import ConfirmPopup from "./confirmPopup";

enum ContentModalType {
  None = 0,
  Edit = 1,
  Delete = 2
}

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
    modalType: ContentModalType;
    selectedGroup?: Group;
  }>({ modalType: ContentModalType.None });
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
  const handleShowEditModal = () => {
    setModalState({ modalType: ContentModalType.Edit });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, modalType: ContentModalType.None }));
  };

  const handleSave = () => {
    refetch();
  };

  const handleEdit = (group: Group) => {
    setModalState({ selectedGroup: group, modalType: ContentModalType.Edit });
    hide();
  };

  const handleDelete = (group: Group) => {
    setModalState({ selectedGroup: group, modalType: ContentModalType.Delete });
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
        <CreateGroupButton onClick={handleShowEditModal} color="primary">
          <AddCircle fontSize="default" />
        </CreateGroupButton>
      </FlexAppBar>
      <ConfirmPopup
        onDeny={handleCloseModal}
        onClose={handleCloseModal}
        onConfirm={handleCloseModal}
        open={modalState.modalType === ContentModalType.Delete}
        heading={"Warning"}
        body={`Are you sure you want to delete ${modalState.selectedGroup?.title}?`}
      />
      <GroupPopUp
        onSave={handleSave}
        heading={modalState.selectedGroup ? "Edit group" : "Create new group"}
        group={modalState.selectedGroup}
        open={modalState.modalType === ContentModalType.Edit}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Content;

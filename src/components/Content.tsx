import * as React from "react";
import useGroups from "../hooks/useGroups";
import GroupPopUp from "./GroupPopup";
import { AppBar, IconButton, withStyles } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import useContextMenu from "../hooks/useContextMenu";
import EditContextMenu from "./EditContextMenu";
import NewContextMenu from "./NewContextMenu";
import ConfirmPopup from "./ConfirmPopup";
import { useSnackbar } from "notistack";
import { SortableTabs, SortableTab } from "./SortableTabBar";
import { arrayMove } from "react-sortable-hoc";
import deleteGroup from "../mutations/deleteGroup";
import updateGroupPositions from "../mutations/updateGroupPositions";
import { Group } from "../types";
import Dials from "./Dials";
import { Loader } from "./Loader";
import useDefaultTab from "../hooks/useDefaultTab";
import saveDefaultTab from "../mutations/saveDefaultTab";

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
  const { defaultTab, isLoading: defaultTabIsLoading } = useDefaultTab();
  const [modalState, setModalState] = React.useState<{
    modalType: ContentModalType;
    selectedGroup?: Group;
  }>({ modalType: ContentModalType.None });
  const { show, hide } = useContextMenu();
  const { enqueueSnackbar } = useSnackbar();
  const [cachedGroups, setCachedGroups] = React.useState(groups);
  const [selectedTab, setSelectedTab] = React.useState(0);

  React.useEffect(() => {
    setSelectedTab(defaultTab);
  }, [defaultTab]);

  React.useMemo(() => {
    groups.sort((a, b) => a.position - b.position);
    setCachedGroups(groups);
  }, [groups]);

  const clampedSelectedTab = React.useMemo(() => {
    return Math.max(Math.min(selectedTab, cachedGroups.length - 1), 0);
  }, [selectedTab, cachedGroups.length]);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
    saveDefaultTab(newValue);
  };

  if (error) {
    return <div>Error loading groups</div>;
  }

  const handleShowEditModal = (group?: Group) => {
    setModalState({ selectedGroup: group, modalType: ContentModalType.Edit });
    hide();
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, modalType: ContentModalType.None }));
  };

  const handleDelete = (group: Group) => {
    setModalState({
      selectedGroup: group,
      modalType: ContentModalType.Delete
    });
    hide();
  };

  const handleDeleteConfirm = async (group: Group) => {
    const result = await deleteGroup(group);

    if (result.error) {
      enqueueSnackbar("Error deleting group", { variant: "error" });
      return;
    }
    enqueueSnackbar("Group deleted", { variant: "success" });
    refetch();
    handleCloseModal();
  };

  const handleRightClick = (
    event: React.MouseEvent<HTMLElement>,
    group?: Group
  ) => {
    event.preventDefault();
    event.stopPropagation();
    show(
      { x: event.clientX, y: event.clientY },
      group ? (
        <EditContextMenu
          onEdit={() => handleShowEditModal(group)}
          onDelete={() => handleDelete(group)}
        />
      ) : (
        <NewContextMenu text="New group" onNew={() => handleShowEditModal()} />
      )
    );
  };

  const handleSortEnd = async ({ oldIndex, newIndex }) => {
    const sortedGroups = arrayMove<Group>(
      cachedGroups,
      oldIndex,
      newIndex
    ).map((el, i) => ({ ...el, position: i }));
    setCachedGroups(sortedGroups);

    const result = await updateGroupPositions(sortedGroups);
    if (result.error) {
      enqueueSnackbar("Error", { variant: "error" });
      return;
    }
  };

  if (defaultTabIsLoading) {
    return <Loader open={isLoading} />;
  }

  return (
    <>
      <FlexAppBar position="fixed" color="default">
        <SortableTabs
          onContextMenu={e => handleRightClick(e)}
          value={clampedSelectedTab}
          onChange={handleChange}
          distance={10}
          onSortEnd={handleSortEnd}
          lockAxis="x"
          axis="x"
        >
          {cachedGroups.map((group, index) => {
            return (
              <SortableTab
                key={group.id}
                index={index}
                tempIndex={index}
                label={group.title}
                onContextMenu={e => handleRightClick(e, group)}
              />
            );
          })}
        </SortableTabs>

        <CreateGroupButton
          onClick={() => handleShowEditModal()}
          color="primary"
        >
          <AddCircle fontSize="default" />
        </CreateGroupButton>
      </FlexAppBar>
      {cachedGroups.length > 0 && (
        <Dials groupId={cachedGroups[clampedSelectedTab].id} />
      )}
      <Loader open={isLoading} />
      <ConfirmPopup
        onDeny={handleCloseModal}
        onClose={handleCloseModal}
        onConfirm={() => handleDeleteConfirm(modalState.selectedGroup)}
        open={modalState.modalType === ContentModalType.Delete}
        heading={"Warning"}
        body={`Are you sure you want to delete ${modalState.selectedGroup?.title}?`}
      />
      <GroupPopUp
        onSave={refetch}
        heading={modalState.selectedGroup ? "Edit group" : "Create new group"}
        group={modalState.selectedGroup}
        open={modalState.modalType === ContentModalType.Edit}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Content;

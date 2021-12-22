import * as React from "react";
import useGroups from "../hooks/useGroups";
import GroupPopUp from "./GroupPopup";
import { AppBar, IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import useContextMenu from "../hooks/useContextMenu";
import EditContextMenu from "./EditContextMenu";
import NewContextMenu from "./NewContextMenu";
import ConfirmPopup from "./ConfirmPopup";
import { useSnackbar } from "notistack";
import { SortableTabbar, SortableTab } from "./SortableTabBar";
import { arrayMoveImmutable as arrayMove } from "array-move";
import deleteGroup from "../mutations/deleteGroup";
import updateGroupPositions from "../mutations/updateGroupPositions";
import { Group } from "../types";
import Dials from "./DialGrid";
import { Loader } from "./Loader";
import useDefaultTab from "../hooks/useDefaultTab";
import saveDefaultTab from "../mutations/saveDefaultTab";
import { Box } from "@mui/system";

enum ContentModalType {
  None = 0,
  Edit = 1,
  Delete = 2,
}

const Content: React.FunctionComponent = () => {
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

  const handleTabClick = (newValue: number) => {
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
    setModalState((prev) => ({ ...prev, modalType: ContentModalType.None }));
  };

  const handleDelete = (group: Group) => {
    setModalState({
      selectedGroup: group,
      modalType: ContentModalType.Delete,
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

  const handleSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const sortedGroups = arrayMove<Group>(cachedGroups, oldIndex, newIndex).map(
      (el, i) => ({ ...el, position: i })
    );
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
      <AppBar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        position="fixed"
        color="default"
      >
        <SortableTabbar
          onContextMenu={(e) => handleRightClick(e)}
          value={clampedSelectedTab}
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
                value={index}
                onClick={handleTabClick}
                label={group.title}
                onContextMenu={(e) => handleRightClick(e, group)}
              />
            );
          })}
        </SortableTabbar>

        <Box
          sx={{
            float: "right",
            margin: "auto",
            paddingRight: "16px",
          }}
        >
          <IconButton onClick={() => handleShowEditModal()} color="primary">
            <AddCircle fontSize="medium" />
          </IconButton>
        </Box>
      </AppBar>
      {cachedGroups.length > 0 && (
        <Dials groupId={cachedGroups[clampedSelectedTab].id} />
      )}
      <Loader open={isLoading} />
      {modalState.modalType === ContentModalType.Delete && (
        <ConfirmPopup
          onDeny={handleCloseModal}
          onClose={handleCloseModal}
          onConfirm={() =>
            modalState.selectedGroup &&
            handleDeleteConfirm(modalState.selectedGroup)
          }
          open
          heading={"Warning"}
          body={`Are you sure you want to delete ${modalState.selectedGroup?.title}?`}
        />
      )}
      {modalState.modalType === ContentModalType.Edit && (
        <GroupPopUp
          onSave={refetch}
          heading={modalState.selectedGroup ? "Edit group" : "Create new group"}
          group={modalState.selectedGroup}
          open
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Content;

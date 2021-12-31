import * as React from "react";
import useDials from "../hooks/useDials";
import { Dial, MAXIMUM_STORAGE_ITEM_SIZE } from "../types";
import useContextMenu from "../hooks/useContextMenu";
import { useSnackbar } from "notistack";
import ConfirmPopup from "./ConfirmPopup";
import DialPopUp from "./DialPopup";
import EditContextMenu from "./EditContextMenu";
import NewContextMenu from "./NewContextMenu";
import { AddCircle } from "@mui/icons-material";
import deleteDial from "../mutations/deleteDial";
import { Grid, Container, Box, Fade, Typography } from "@mui/material";
import { SortableCard, SortableCardContainer } from "./DialCard";
import { SortEndHandler } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
import updateDialPositions from "../mutations/updateDialPositions";
import { Loader } from "./Loader";
import useSyncStorageSize from "../hooks/useSyncStorageSize";

enum ContentModalType {
  None = 0,
  Edit = 1,
  Delete = 2,
}

interface DialProps {
  groupId: string;
}

const Dials: React.FunctionComponent<DialProps> = ({ groupId }) => {
  const { dials, isLoading, error } = useDials(groupId);
  const [modalState, setModalState] = React.useState<{
    modalType: ContentModalType;
    selectedDial?: Dial;
  }>({ modalType: ContentModalType.None });
  const [cachedDials, setCachedDials] = React.useState(dials);
  const {
    data: { size },
  } = useSyncStorageSize(`dials-${groupId}`);

  React.useEffect(() => {
    const dialsCopy = [...dials];
    dialsCopy.sort((a, b) => a.position - b.position);
    setCachedDials(dialsCopy);
  }, [dials]);

  const { show, hide } = useContextMenu();
  const { enqueueSnackbar } = useSnackbar();

  if (error) {
    return <div>Error loading dials</div>;
  }

  const handleShowEditModal = (dial?: Dial) => {
    setModalState({ selectedDial: dial, modalType: ContentModalType.Edit });
    hide();
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, modalType: ContentModalType.None }));
  };

  const handleDelete = (dial: Dial) => {
    setModalState({
      selectedDial: dial,
      modalType: ContentModalType.Delete,
    });
    hide();
  };

  const handleDeleteConfirm = async (dial: Dial) => {
    const result = await deleteDial(dial);
    if (result.error) {
      enqueueSnackbar("Error deleting dial", { variant: "error" });
      return;
    }
    enqueueSnackbar("Dial deleted", { variant: "success" });
    handleCloseModal();
  };

  const handleRightClick = (
    event: React.MouseEvent<HTMLElement>,
    dial?: Dial
  ) => {
    event.preventDefault();
    event.stopPropagation();
    show(
      { x: event.clientX, y: event.clientY },
      dial ? (
        <EditContextMenu
          onEdit={() => handleShowEditModal(dial)}
          onDelete={() => handleDelete(dial)}
        />
      ) : (
        <NewContextMenu text="New dial" onNew={() => handleShowEditModal()} />
      )
    );
  };

  const handleSortEnd: SortEndHandler = async ({ oldIndex, newIndex }) => {
    setCachedDials((prev) => {
      const sortedDials = arrayMove<Dial>(prev, oldIndex, newIndex).map(
        (el, i) => ({ ...el, position: i })
      );
      updateDialPositions(sortedDials).catch(() => {
        enqueueSnackbar("Error", { variant: "error" });
      });

      return sortedDials;
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        flexDirection: "column",
        paddingTop: "100px",
        minHeight: "100%",
      }}
      onContextMenu={handleRightClick}
    >
      <Fade in={!isLoading}>
        <Container sx={{ marginBottom: "16px" }}>
          <SortableCardContainer
            axis="xy"
            distance={10}
            onSortEnd={handleSortEnd}
          >
            {cachedDials.map((dial, i) => (
              <SortableCard
                onContextMenu={(e) => handleRightClick(e, dial)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                key={dial.id}
                index={i}
                dial={dial}
              />
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                onClick={() => handleShowEditModal()}
                role="button"
                sx={{
                  paddingTop: "56.25%",
                  position: "relative",
                  borderRadius: (theme) => theme.shape.borderRadius,
                  borderColor: (theme) => theme.palette.text.primary,
                  borderWidth: "1px",
                  borderStyle: "dashed",
                  opacity: 0.5,
                  "&:hover": {
                    opacity: 1,
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: "8px",
                  }}
                >
                  <AddCircle
                    fontSize="medium"
                    sx={{
                      fontSize: 60,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {Math.ceil((size / MAXIMUM_STORAGE_ITEM_SIZE) * 100)}% space
                    used
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </SortableCardContainer>
        </Container>
      </Fade>

      <Loader open={isLoading && dials.length === 0} />
      <Box />

      {modalState.modalType === ContentModalType.Delete && (
        <ConfirmPopup
          onDeny={handleCloseModal}
          onClose={handleCloseModal}
          onConfirm={() =>
            modalState.selectedDial &&
            handleDeleteConfirm(modalState.selectedDial)
          }
          open
          heading={"Warning"}
          body={`Are you sure you want to delete ${modalState.selectedDial?.alias}?`}
        />
      )}

      {modalState.modalType === ContentModalType.Edit && (
        <DialPopUp
          heading={modalState.selectedDial ? "Edit dial" : "Create new dial"}
          groupId={groupId}
          dial={modalState.selectedDial}
          open
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default Dials;

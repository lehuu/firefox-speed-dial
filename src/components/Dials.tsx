import * as React from "react";
import useDials from "../hooks/useDials";
import { Dial } from "../types";
import useContextMenu from "../hooks/useContextMenu";
import { useSnackbar } from "notistack";
import ConfirmPopup from "./ConfirmPopup";
import DialPopUp from "./DialPopup";
import EditContextMenu from "./EditContextMenu";
import NewContextMenu from "./NewContextMenu";
import AddCircle from "@material-ui/icons/AddCircle";
import deleteDial from "../mutations/deleteDial";
import { Grid, Container, makeStyles, Box, Fade } from "@material-ui/core";
import { SortableCard, SortableCardContainer } from "./DialCard";
import { arrayMove } from "react-sortable-hoc";
import updateDialPositions from "../mutations/updateDialPositions";
import { Loader } from "./Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "column",
    paddingTop: "60px",
    minHeight: "100%",
  },
  button: {
    paddingTop: "56.25%",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.text.primary,
    borderWidth: "1px",
    borderStyle: "dashed",
    opacity: 0.5,
    "&:hover": {
      opacity: 1,
      cursor: "pointer",
    },
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: 60,
  },
}));

enum ContentModalType {
  None = 0,
  Edit = 1,
  Delete = 2,
}

interface DialProps {
  groupId: string;
}

const Dials: React.FunctionComponent<DialProps> = ({ groupId }) => {
  const classes = useStyles();
  const { dials, isLoading, error, refetch } = useDials(groupId);
  const [modalState, setModalState] = React.useState<{
    modalType: ContentModalType;
    selectedDial?: Dial;
  }>({ modalType: ContentModalType.None });
  const [cachedDials, setCachedDials] = React.useState(dials);

  React.useMemo(() => {
    dials.sort((a, b) => a.position - b.position);
    setCachedDials(dials);
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
    refetch();
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

  const handleSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const sortedDials = arrayMove<Dial>(cachedDials, oldIndex, newIndex).map(
      (el, i) => ({ ...el, position: i })
    );
    setCachedDials(sortedDials);

    const result = await updateDialPositions(sortedDials);
    if (result.error) {
      enqueueSnackbar("Error", { variant: "error" });
      return;
    }
  };

  return (
    <div className={classes.root} onContextMenu={handleRightClick}>
      <Fade in={!isLoading}>
        <Container>
          <SortableCardContainer
            axis="xy"
            distance={10}
            onSortEnd={handleSortEnd}
          >
            {cachedDials.map((dial, i) => (
              <SortableCard
                onContextMenu={(e) => handleRightClick(e, dial)}
                key={dial.id}
                index={i}
                dial={dial}
              />
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                onClick={() => handleShowEditModal()}
                className={classes.button}
              >
                <AddCircle className={classes.icon} />
              </Box>
            </Grid>
          </SortableCardContainer>
        </Container>
      </Fade>

      <Loader open={isLoading} />
      <div />

      <ConfirmPopup
        onDeny={handleCloseModal}
        onClose={handleCloseModal}
        onConfirm={() => handleDeleteConfirm(modalState.selectedDial)}
        open={modalState.modalType === ContentModalType.Delete}
        heading={"Warning"}
        body={`Are you sure you want to delete ${modalState.selectedDial?.alias}?`}
      />
      <DialPopUp
        onSave={refetch}
        heading={modalState.selectedDial ? "Edit dial" : "Create new dial"}
        groupId={groupId}
        dial={modalState.selectedDial}
        open={modalState.modalType === ContentModalType.Edit}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dials;

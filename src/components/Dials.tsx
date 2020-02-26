import * as React from "react";
import useDials from "../hooks/useDials";
import { Dial } from "../types";
import useContextMenu from "../hooks/useContextMenu";
import { useSnackbar } from "notistack";
import ConfirmPopup from "./ConfirmPopup";
import DialPopUp from "./DialPopup";
import EditContextMenu from "./EditContextMenu";
import NewContextMenu from "./NewContextMenu";
import deleteDial from "../mutations/deleteDial";

enum ContentModalType {
  None = 0,
  Edit = 1,
  Delete = 2
}

interface DialProps {
  groupId: string;
}

const Dials: React.SFC<DialProps> = ({ groupId }) => {
  const { dials, isLoading, error, refetch } = useDials(groupId);
  const [modalState, setModalState] = React.useState<{
    modalType: ContentModalType;
    selectedDial?: Dial;
  }>({ modalType: ContentModalType.None });

  React.useMemo(() => {
    dials.sort((a, b) => a.position - b.position);
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
    setModalState(prev => ({ ...prev, modalType: ContentModalType.None }));
  };

  const handleDelete = (dial: Dial) => {
    setModalState({
      selectedDial: dial,
      modalType: ContentModalType.Delete
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

  return (
    <div>
      {dials.map(dial => (
        <div onContextMenu={e => handleRightClick(e, dial)} key={dial.id}>
          {dial.alias}
        </div>
      ))}
      <button onClick={() => handleShowEditModal()}>Add new dial</button>
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

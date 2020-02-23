import * as React from "react";
import useGroups from "../hooks/useGroups";
import GroupPopUp from "./groupPopup";

const App: React.SFC<any> = () => {
  const { groups, isLoading, error, refetch } = useGroups();
  const [isModalShown, setIsModalShown] = React.useState(false);

  React.useMemo(() => {
    groups.sort((a, b) => a.position - b.position);
  }, [groups]);

  if (error) {
    return <div>Error loading groups</div>;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

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
    <div>
      {groups.map(group => (
        <div key={group.id}>{group.title}</div>
      ))}
      <button onClick={handleShowModal}>+</button>
      <GroupPopUp
        onSave={handleSave}
        heading="Create new group"
        open={isModalShown}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default App;

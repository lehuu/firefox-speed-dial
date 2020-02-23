import * as React from "react";
import useGroups from "../hooks/useGroups";

const App: React.SFC<any> = () => {
  const { groups, isLoading, error } = useGroups();

  React.useMemo(() => {
    groups.sort((a, b) => a.position - b.position);
  }, [groups]);

  if (error) {
    return <div>Error loading groups</div>;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      {groups.map(group => (
        <div>{group.title}</div>
      ))}
      <button>+</button>
    </div>
  );
};

export default App;
